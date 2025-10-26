import ChartCard, { type ChartSpec } from "./ChartCard";

export type KRI = { title: string; value: string; hint?: string; pct?: number };

export default function DashboardView({
  kri,
  charts,
}: {
  kri: KRI;
  charts: [ChartSpec, ChartSpec, ChartSpec];
}) {
  return (
    <div className="w-full text-white">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight">Resumen general</h1>

      {/* Grid 12 con alturas controladas y recorte correcto */}
      <div className="grid grid-cols-12 gap-6 auto-rows-[minmax(0,1fr)]">
        {/* Fila 1: KRI (4) + Línea (8) con MISMA altura */}
        <section className="col-span-12 md:col-span-4 rounded-2xl border border-white/10 bg-black/25 p-5
                            md:h-[300px] min-h-[220px] flex flex-col justify-between">
          <div>
            <div className="text-xs text-gray-300">{kri.title}</div>
            <div className="mt-1 text-5xl font-extrabold text-cyan-300 leading-none">{kri.value}</div>
            {kri.hint && <div className="mt-2 text-sm text-gray-300">{kri.hint}</div>}
          </div>
          {typeof kri.pct === "number" && (
            <div className="pt-2">
              <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
                <div className="h-2 bg-cyan-400" style={{ width: `${kri.pct}%` }} />
              </div>
              <div className="mt-1 text-[11px] text-gray-400">
                umbral 70% • estado: {kri.pct >= 70 ? "saludable" : "riesgo"}
              </div>
            </div>
          )}
        </section>

        <section className="col-span-12 md:col-span-8 rounded-2xl border border-white/10 bg-black/25 p-4
                            md:h-[300px] min-h-[220px] min-w-0">
          <div className="mb-2 text-sm font-semibold">{charts[0].title}</div>
          <div className="h-[calc(100%-1.75rem)] min-h-0">
            <ChartCard spec={charts[0]} fill />
          </div>
        </section>

        {/* Fila 2: dos paneles 50/50 con altura consistente */}
        <section className="col-span-12 md:col-span-6 rounded-2xl border border-white/10 bg-black/25 p-4
                            md:h-[340px] min-h-[240px] min-w-0">
          <div className="mb-2 text-sm font-semibold">{charts[1].title}</div>
          <div className="h-[calc(100%-1.75rem)] min-h-0">
            <ChartCard spec={charts[1]} fill />
          </div>
        </section>

        <section className="col-span-12 md:col-span-6 rounded-2xl border border-white/10 bg-black/25 p-4
                            md:h-[340px] min-h-[240px] min-w-0">
          <div className="mb-2 text-sm font-semibold">{charts[2].title}</div>
          <div className="h-[calc(100%-1.75rem)] min-h-0">
            <ChartCard spec={charts[2]} fill />
          </div>
        </section>
      </div>
    </div>
  );
}
