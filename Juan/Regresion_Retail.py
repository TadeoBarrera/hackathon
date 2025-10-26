# requirements: pandas scikit-learn numpy
from __future__ import annotations
import numpy as np
import pandas as pd
from typing import List, Optional, Dict, Any, Tuple

from sklearn.model_selection import GridSearchCV, train_test_split, TimeSeriesSplit
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score


class TabularRegressor:
    """
    End-to-end tabular regression:
      - One-hot for categorical, passthrough numeric
      - RandomForest with GridSearchCV
      - Metrics + feature importances

    Usage:
        tr = TabularRegressor(
            target="quantity_consumed",
            feature_cols=[...],
            cat_cols=["origin","flight_type","date_dayofweek","date_is_weekend","date_is_month_start","date_is_month_end"],
            test_size=0.2, random_state=42, time_col=None  # set time_col for temporal split
        )
        tr.fit(df)
        metrics = tr.evaluate()
        preds = tr.predict(df_new)
        fi = tr.feature_importances()
        params = tr.best_params_
    """

    def __init__(
        self,
        target: str,
        feature_cols: List[str],
        cat_cols: Optional[List[str]] = None,
        test_size: float = 0.2,
        random_state: int = 42,
        time_col: Optional[str] = None,      # if provided, uses temporal split
        rf_param_grid: Optional[Dict[str, List[Any]]] = None,
        n_jobs: int = -1,
    ):
        self.target = target
        self.feature_cols = feature_cols
        self.cat_cols = cat_cols or []
        self.num_cols = [c for c in feature_cols if c not in self.cat_cols]
        self.test_size = test_size
        self.random_state = random_state
        self.time_col = time_col
        self.n_jobs = n_jobs

        # Preprocessor
        self.pre = ColumnTransformer(
            transformers=[
                ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), self.cat_cols),
                ("num", "passthrough", self.num_cols),
            ],
            remainder="drop",
        )

        # Estimator
        self.rf = RandomForestRegressor(random_state=self.random_state, n_jobs=self.n_jobs)
        self.pipe = Pipeline([("pre", self.pre), ("rf", self.rf)])

        # Search space
        self.param_grid = rf_param_grid or {
            "rf__n_estimators": [200, 400],
            "rf__max_depth": [None, 8, 14],
            "rf__min_samples_leaf": [1, 3, 5],
            "rf__max_features": ["sqrt", 0.7],
        }

        self.gs: Optional[GridSearchCV] = None
        self.best_: Optional[Pipeline] = None
        self._splits: Optional[Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]] = None
        self._metrics: Optional[Dict[str, float]] = None

    # ---- helpers ----
    def _make_split(self, df: pd.DataFrame) -> None:
        X = df[self.feature_cols].copy()
        y = df[self.target].astype(float)

        if self.time_col:
            # Temporal split: last test_size fraction is test
            df_sorted = df.sort_values(self.time_col)
            n = len(df_sorted)
            cut = int(np.floor((1 - self.test_size) * n))
            train_idx = df_sorted.index[:cut]
            test_idx = df_sorted.index[cut:]
            Xtr, Xte = X.loc[train_idx], X.loc[test_idx]
            ytr, yte = y.loc[train_idx], y.loc[test_idx]
        else:
            Xtr, Xte, ytr, yte = train_test_split(
                X, y, test_size=self.test_size, random_state=self.random_state
            )

        self._splits = (Xtr, Xte, ytr, yte)

    def _cv_strategy(self, n_splits: int = 3):
        if self.time_col:
            return TimeSeriesSplit(n_splits=n_splits)
        return n_splits

    # ---- API ----
    def fit(self, df: pd.DataFrame) -> "TabularRegressor":
        assert all(c in df.columns for c in self.feature_cols+[self.target])
        if self.time_col:
            assert self.time_col in df.columns

        self._make_split(df)
        Xtr, _, ytr, _ = self._splits

        self.gs = GridSearchCV(
            self.pipe,
            self.param_grid,
            scoring="neg_root_mean_squared_error",
            cv=self._cv_strategy(3),
            n_jobs=self.n_jobs,
            verbose=0,
        )
        self.gs.fit(Xtr, ytr)
        self.best_ = self.gs.best_estimator_
        return self

    @property
    def best_params_(self) -> Dict[str, Any]:
        if not self.gs:
            return {}
        return dict(self.gs.best_params_)

    def evaluate(self) -> Dict[str, float]:
        assert self.best_ is not None, "Call fit() first."
        _, Xte, _, yte = self._splits
        pred = self.best_.predict(Xte)
        self._metrics = {
            "rmse": float(mean_squared_error(yte, pred, squared=False)),
            "mae": float(mean_absolute_error(yte, pred)),
            "r2": float(r2_score(yte, pred)),
        }
        return self._metrics

    def predict(self, df_new: pd.DataFrame) -> np.ndarray:
        assert self.best_ is not None, "Call fit() first."
        X = df_new[self.feature_cols].copy()
        return self.best_.predict(X)

    def _final_feature_names(self) -> List[str]:
        assert self.best_ is not None, "Call fit() first."
        ohe = self.best_.named_steps["pre"].named_transformers_["cat"]
        cat_names = list(ohe.get_feature_names_out(self.cat_cols)) if self.cat_cols else []
        return cat_names + self.num_cols

    def feature_importances(self) -> pd.DataFrame:
        assert self.best_ is not None, "Call fit() first."
        names = self._final_feature_names()
        imps = self.best_.named_steps["rf"].feature_importances_
        fi = pd.DataFrame({"feature": names, "importance": imps})
        return fi.sort_values("importance", ascending=False).reset_index(drop=True)
    
    def predict_from_array(self, values) -> float:
        """values must follow self.feature_cols order."""
        assert self.best_ is not None, "Call fit() first."
        if len(values) != len(self.feature_cols):
            raise ValueError(f"Expected {len(self.feature_cols)} values, got {len(values)}.")
        row = pd.DataFrame([values], columns=self.feature_cols)
        return float(self.predict(row)[0])

