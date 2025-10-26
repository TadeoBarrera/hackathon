import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";

export type Row = Record<string, string | number | null>;
export type ChartType = "line" | "bar" | "table";
export type Series = { key: string; label?: string };
export type ChartSpec = {
  id: string;
  type: ChartType;
  title?: string;
  xKey?: string;
  series?: Series[];
  data: Row[];
};

export default function ChartCard({ spec, fill }: { spec: ChartSpec; fill?: boolean }) {
  const grid = "#233045", axis = "#7d8da1", line = "#20b2e6", bar = "#1f2b3a";
  const box = fill ? "h-full w-full" : "h-64 w-full";

  if (spec.type === "table") {
    const cols = Array.from(
      spec.data.reduce<Set<string>>((s, r) => { Object.keys(r).forEach(k => s.add(k)); return s; }, new Set())
    );
    return (
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full text-sm text-white/90">
          <thead className="bg-black/40 text-gray-400">
            <tr>{cols.map(c => <th key={c} className="px-3 py-2 text-left font-medium">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {spec.data.map((row, i) => (
              <tr key={i} className="hover:bg-white/5">
                {cols.map(c => <td key={c} className="px-3 py-2">{String(row[c] ?? "")}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={box}>
      <ResponsiveContainer>
        {spec.type === "line" ? (
          <LineChart data={spec.data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
            {spec.xKey && <XAxis dataKey={spec.xKey} stroke={grid} tick={{ fill: axis, fontSize: 12 }} />}
            <YAxis stroke={grid} tick={{ fill: axis, fontSize: 12 }} />
            <Tooltip contentStyle={{ background:"#0f141b", border:"1px solid #233045", color:"#e7edf3" }} />
            <Legend wrapperStyle={{ color:"#cfe3f3" }} />
            {(spec.series ?? []).map(s => (
              <Line key={s.key} dataKey={s.key} name={s.label ?? s.key} type="monotone" dot={false} strokeWidth={2} stroke={line} />
            ))}
          </LineChart>
        ) : (
          <BarChart data={spec.data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
            {spec.xKey && <XAxis dataKey={spec.xKey} stroke={grid} tick={{ fill: axis, fontSize: 12 }} />}
            <YAxis stroke={grid} tick={{ fill: axis, fontSize: 12 }} />
            <Tooltip contentStyle={{ background:"#0f141b", border:"1px solid #233045", color:"#e7edf3" }} />
            <Legend wrapperStyle={{ color:"#cfe3f3" }} />
            {(spec.series ?? []).map(s => (
              <Bar key={s.key} dataKey={s.key} name={s.label ?? s.key} fill={bar} radius={[6,6,0,0]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
