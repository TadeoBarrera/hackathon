# requirements: pandas, numpy, scikit-learn

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from math import sqrt

def add_date_features_daily(df: pd.DataFrame, date_col: str, tz: str | None = None) -> pd.DataFrame:
    s = pd.to_datetime(df[date_col], errors="coerce", utc=bool(tz))
    if tz:
        s = s.dt.tz_convert(tz)
    s = s.dt.floor("D")
    s = s.dt.tz_localize(None) if hasattr(s.dt, "tz") else s

    iso = s.dt.isocalendar()
    df[f"{date_col}_year"]      = s.dt.year
    df[f"{date_col}_month"]     = s.dt.month
    df[f"{date_col}_day"]       = s.dt.day
    df[f"{date_col}_dayofweek"] = s.dt.dayofweek
    df[f"{date_col}_is_weekend"] = (df[f"{date_col}_dayofweek"] >= 5).astype("int8")
    df[f"{date_col}_week"]      = iso.week.astype("Int16")

    df[f"{date_col}_is_month_start"]   = s.dt.is_month_start.astype("int8")
    df[f"{date_col}_is_month_end"]     = s.dt.is_month_end.astype("int8")
    df[f"{date_col}_is_quarter_start"] = s.dt.is_quarter_start.astype("int8")
    df[f"{date_col}_is_quarter_end"]   = s.dt.is_quarter_end.astype("int8")

    def sincos(series, period):
        x = 2 * np.pi * series.astype("float64") / period
        return np.sin(x), np.cos(x)

    m0 = (df[f"{date_col}_month"] - 1)
    df[f"{date_col}_month_sin"], df[f"{date_col}_month_cos"] = sincos(m0, 12)

    dow = df[f"{date_col}_dayofweek"]
    df[f"{date_col}_dow_sin"], df[f"{date_col}_dow_cos"] = sincos(dow, 7)
    return df


class RandomForestDailyRegressor:
    def __init__(self, n_estimators: int = 600, max_depth: int | None = None, random_state: int = 42):
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            random_state=random_state,
            n_jobs=-1,
        )
        self.date_col: str | None = None
        self.target_col: str | None = None
        self.feature_names_: list[str] | None = None
        self.tz: str | None = None
        self.fitted_: bool = False

    def _make_features(self, df: pd.DataFrame) -> pd.DataFrame:
        if self.date_col is None:
            raise ValueError("date_col not set")
        tmp = df.copy()
        tmp = add_date_features_daily(tmp, self.date_col, tz=self.tz)

        # optional: include a time-trend
        s = pd.to_datetime(tmp[self.date_col], errors="coerce")
        tmp[f"{self.date_col}_ordinal"] = s.view("int64") // 86_400_000_000_000  # days since epoch

        feats = [c for c in tmp.columns if c.startswith(f"{self.date_col}_")]
        X = tmp[feats].astype("float64")
        return X

    def fit(self, df: pd.DataFrame, date_col: str, target_col: str, tz: str | None = None):
        self.date_col = date_col
        self.target_col = target_col
        self.tz = tz

        df = df.copy()
        df[self.date_col] = pd.to_datetime(df[self.date_col], errors="coerce")
        df = df.dropna(subset=[self.date_col, self.target_col])

        X = self._make_features(df)
        y = pd.to_numeric(df[self.target_col], errors="coerce").astype("float64")
        mask = y.notna()
        X, y = X[mask], y[mask]

        self.model.fit(X, y)
        self.feature_names_ = list(X.columns)
        self.fitted_ = True
        return self

    def predict(self, df_future: pd.DataFrame) -> pd.Series:
        if not self.fitted_:
            raise RuntimeError("Call fit() first.")
        Xf = self._make_features(df_future)
        # Align to training features in case of column order issues
        Xf = Xf.reindex(columns=self.feature_names_, fill_value=0.0)
        preds = self.model.predict(Xf)
        return pd.Series(preds, index=df_future.index, name=f"{self.target_col}_pred")

    def feature_importances(self) -> pd.Series:
        if not self.fitted_:
            raise RuntimeError("Call fit() first.")
        return pd.Series(self.model.feature_importances_, index=self.feature_names_).sort_values(ascending=False)
    
    
    def evaluate(
        self,
        df: pd.DataFrame,
        date_col: str | None = None,
        target_col: str | None = None,
        tz: str | None = None,
        test_size: float = 0.2,
        retrain: bool = False,
    ) -> dict:
        # Resolve columns and tz
        if date_col is not None:
            self.date_col = date_col
        if target_col is not None:
            self.target_col = target_col
        if tz is not None:
            self.tz = tz
        if self.date_col is None or self.target_col is None:
            raise ValueError("date_col and target_col must be set or provided.")

        df = df.copy()
        df[self.date_col] = pd.to_datetime(df[self.date_col], errors="coerce")
        y = pd.to_numeric(df[self.target_col], errors="coerce").astype("float64")
        keep = df[self.date_col].notna() & y.notna()
        df, y = df[keep], y[keep]

        X = self._make_features(df)
        n = len(X)
        if n < 10:
            raise ValueError("Not enough rows to evaluate. Need at least 10.")
        split = max(1, int(n * (1 - test_size)))
        X_train, X_test = X.iloc[:split], X.iloc[split:]
        y_train, y_test = y.iloc[:split], y.iloc[split:]

        if retrain or not self.fitted_:
            self.model.fit(X_train, y_train)
            self.feature_names_ = list(X_train.columns)
            self.fitted_ = True

        y_pred = self.model.predict(X_test)

        # Metrics
        mse = mean_squared_error(y_test, y_pred)
        rmse = rmse = np.sqrt(mse)
        eps = 1e-9
        mape = float(np.mean(np.abs((y_test - y_pred) / (np.abs(y_test) + eps))) * 100.0)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        return {
            "MSE": mse,
            "RMSE": rmse,
            "MAPE_%": mape,
            "R2": r2,
            "n_train": int(len(X_train)),
            "n_test": int(len(X_test)),
        }
