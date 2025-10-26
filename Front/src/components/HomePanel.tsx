// src/components/HomePanel.tsx
import { useEffect, useMemo, useState } from "react";
import DashboardDynamic, { type WidgetInput } from "./DashboardDynamic";
import { askDashboard } from "../lib/api";

// --- ADAPTADOR/Normalizador ---
// 1) Garantiza que line/bar tengan data[], xKey y series válidas.
// 2) Acepta series con {key} o con {dataKey} o strings y las convertimos a {dataKey}.
// 3) Convierte números string → number si hace falta.
function adaptWidgets(ws: any[]): WidgetInput[] {
  const toNum = (v: any) => (typeof v === "number" ? v : Number(v) || 0);

  const normSeriesObj = (s: any) => {
    // series puede llegar como { key: 'real' } o { dataKey: 'real' } o 'real'
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
      const series = Array.isArray(w.series) && w.series.length
        ? w.series.map(normSeriesObj)
        : [{ dataKey: "real" }, { dataKey: "opt" }];

      const data = Array.isArray(w.data) ? w.data.map((row: any) => {
        const r: any = { ...row };
        // coerción a número para cada serie
        series.forEach((s: any) => (r[s.dataKey] = toNum(r[s.dataKey])));
        return r;
      }) : [];

      return {
        id: w.id ?? "l1",
        type: "line",
        title: w.title ?? "Óptimo vs Real",
        data,
        xKey,
        // devolvemos ambas claves por compatibilidad con tu DashboardDynamic
        series: series.map((s: any) => ({ key: s.dataKey, dataKey: s.dataKey })),
      } as any;
    }

    if (w.type === "bar") {
      const xKey = w.xKey ?? "x";
      const series = Array.isArray(w.series) && w.series.length
        ? w.series.map(normSeriesObj)
        : [{ dataKey: "p" }];

      const data = Array.isArray(w.data) ? w.data.map((row: any) => {
        const r: any = { ...row };
        series.forEach((s: any) => (r[s.dataKey] = toNum(r[s.dataKey])));
        return r;
      }) : [];

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

  // re-render key para forzar repintado si el componente hace memo/shallow
  const forceKey = useMemo(() => JSON.stringify(widgets).length, [widgets]);

  // Carga inicial
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

  // Escucha al ChatPanel
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
    <div className="w-full p-6 text-white">
      <h1 className="text-3xl font-extrabold mb-4">Resumen General</h1>

      {err && <div className="text-red-400 mb-3">Error: {err}</div>}
      {loading ? (
        <div className="text-gray-300">Cargando…</div>
      ) : (
        <DashboardDynamic key={forceKey} widgets={widgets} />
      )}
    </div>
  );
}
