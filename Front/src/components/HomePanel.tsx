// src/components/HomePanel.tsx
import { useEffect, useMemo, useState } from "react";
import DashboardDynamic, { type WidgetInput } from "./DashboardDynamic";
import { askDashboard } from "../lib/api";

// --- ADAPTADOR/Normalizador ---
function adaptWidgets(ws: any[]): WidgetInput[] {
  const toNum = (v: any) => (typeof v === "number" ? v : Number(v) || 0);
  const normSeriesObj = (s: any) => {
    if (typeof s === "string") return { dataKey: s };
    if (s && typeof s === "object") {
      return { dataKey: s.dataKey ?? s.key ?? s.k ?? "value" };
    }
    return { dataKey: "value" };
  };

  return (ws ?? []).map((w) => {
    if (w.type === "kpi") {
      return {
        id: w.id ?? "k1",
        type: "kpi",
        title: w.title ?? "Ganancia Potencial",
        value: toNum(w.value),
      };
    }

    if (w.type === "line") {
      const xKey = w.xKey ?? "x";
      const series =
        Array.isArray(w.series) && w.series.length
          ? w.series.map(normSeriesObj)
          : [{ dataKey: "real" }, { dataKey: "opt" }];

      const data = Array.isArray(w.data)
        ? w.data.map((row: any) => {
            const r: any = { ...row };
            series.forEach((s: any) => (r[s.dataKey] = toNum(r[s.dataKey])));
            return r;
          })
        : [];

      return {
        id: w.id ?? "l1",
        type: "line",
        title: w.title ?? "Óptimo vs Real",
        data,
        xKey,
        series: series.map((s: any) => ({ key: s.dataKey, dataKey: s.dataKey })),
      } as any;
    }

    if (w.type === "bar") {
      const xKey = w.xKey ?? "x";
      const series =
        Array.isArray(w.series) && w.series.length
          ? w.series.map(normSeriesObj)
          : [{ dataKey: "p" }];

      const data = Array.isArray(w.data)
        ? w.data.map((row: any) => {
            const r: any = { ...row };
            series.forEach((s: any) => (r[s.dataKey] = toNum(r[s.dataKey])));
            return r;
          })
        : [];

      return {
        id: w.id ?? "b1",
        type: "bar",
        title: w.title ?? "Cobranza",
        data,
        xKey,
        series: series.map((s: any) => ({ key: s.dataKey, dataKey: s.dataKey })),
      } as any;
    }

    if (w.type === "table") {
      return {
        id: w.id ?? "t1",
        type: "table",
        title: w.title ?? "Sustento",
        data: Array.isArray(w.data) ? w.data : [],
        columns: Array.isArray(w.columns) ? w.columns : [],
      };
    }

    return w as WidgetInput;
  });
}

export default function HomePanel() {
  const [widgets, setWidgets] = useState<WidgetInput[]>([
    { id: "k1", type: "kpi",   title: "Ganancia Potencial", value: 0 },
    { id: "l1", type: "line",  title: "Óptimo vs Real", data: [], xKey: "x", series: [{ key: "real" }, { key: "opt" }] },
    { id: "b1", type: "bar",   title: "Cobranza",        data: [], xKey: "x", series: [{ key: "p" }] },
    { id: "t1", type: "table", title: "Sustento",        data: [], columns: [] },
  ]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // -- SQL compacta (placeholder) --
  const [sqlPreview] = useState<string>(
    "SELECT month, real, opt FROM kpis_ingresos WHERE year = 2025 ORDER BY month;"
  );
  const [showSqlBar, setShowSqlBar] = useState(false);

  // Ctrl + Q -> mostrar/ocultar barra SQL
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        setShowSqlBar((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const forceKey = useMemo(() => JSON.stringify(widgets).length, [widgets]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await askDashboard("genera datos iniciales para el dashboard");
        const adapted = adaptWidgets(res.widgets);
        console.log("[init] widgets adaptados:", adapted);
        setWidgets(adapted);
      } catch (e: any) {
        setErr(e?.message ?? "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<WidgetInput[]>;
      const adapted = adaptWidgets(ce.detail as any[]);
      console.log("[dashboard:update] widgets adaptados:", adapted);
      setWidgets(adapted);
    };
    window.addEventListener("dashboard:update", handler as EventListener);
    return () => window.removeEventListener("dashboard:update", handler as EventListener);
  }, []);

  return (
    <div className="w-full p-6 text-[#1E40AF]">
      {/* Barra SQL compacta (arriba del título). Toggle con Ctrl+Q */}
      {showSqlBar ? (
        <div className="mb-2 mt-[-40px] ">
          <div className="flex items-center justify-between gap-2
                          rounded-md border border-slate-200 bg-white shadow-sm px-3 py-1.5">
            <code
              className="font-mono text-[12.5px] text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis pr-2"
              title={sqlPreview}
              role="textbox"
              aria-readonly="true"
            >
              {sqlPreview}
            </code>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(sqlPreview)}
              className="shrink-0 rounded-md bg-[#1E40AF] hover:bg-[#1D4ED8] active:bg-[#1E3A8A]
                         text-white text-xs font-semibold px-2.5 py-1 "
            >
              Copiar
            </button>
          </div>
        </div>
      ) : (
        // Hint más arriba (margen superior negativo)
        <div className="mt-[-40px] mb-1 text-center">
          <span className="text-[11px] text-slate-500">
            Presiona{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-slate-100 text-slate-700 text-[10px]">
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-slate-100 text-slate-700 text-[10px]">
              Q
            </kbd>{" "}
            para ver la query
          </span>
        </div>
      )}

      {/* Título centrado */}
      <div className="mb-6 text-center">
<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#152865]">
          Explorador de Datos
        </h1>
        <p className="mt-1 text-sm md:text-base text-slate-600">
          Visualiza tus métricas y la consulta que las respalda.
        </p>
      </div>

      {err && <div className="text-red-600 mb-3">Error: {err}</div>}
      {loading ? (
        <div className="text-slate-500">Cargando…</div>
      ) : (
        <DashboardDynamic key={forceKey} widgets={widgets} />
      )}
    </div>
  );
}
