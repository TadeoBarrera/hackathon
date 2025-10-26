// src/components/HomePanel.tsx
import DashboardDynamic, { type WidgetInput } from "./DashboardDynamic";

export default function HomePanel() {
  const widgets: WidgetInput[] = [
    { id: "k1", type: "kpi",   title: "Ganancia Potencial", value: 1685099.95 },
    { id: "l1", type: "line",  title: "Óptimo vs Real", data: [], xKey: "x", series: [{ key: "real" }, { key: "opt" }] },
    { id: "b1", type: "bar",   title: "Cobranza",        data: [], xKey: "x", series: [{ key: "p" }] },
    { id: "t1", type: "table", title: "Sustento",        data: [], columns: [] },
  ];

  return (
    <div className="w-full p-6 text-white">
      <h1 className="text-3xl font-extrabold mb-4">Resumen General</h1>
      <DashboardDynamic widgets={widgets} />
    </div>
  );
}
