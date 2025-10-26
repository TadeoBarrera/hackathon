import {
  ResponsiveContainer,
  LineChart as RCLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

type LineChartProps = {
  title?: string;
  data?: Array<Record<string, unknown>>;
  xKey?: string;
  series?: { key: string; label?: string }[];
  className?: string;
};

export default function LineChart({
  title,
  data = [],
  xKey = "x",
  series = [{ key: "real" }, { key: "opt" }],
  className,
}: LineChartProps) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className={`w-full h-full bg-[#15243D] text-white p-3 rounded-lg ${className ?? ""}`}>
      {title && <h3 className="text-sm font-semibold mb-2">{title}</h3>}

      {!hasData ? (
        <div className="w-full h-[calc(100%-0.75rem)] flex items-center justify-center text-xs opacity-70">
          Gráfica de línea (sin datos)
        </div>
      ) : (
        <div className="w-full h-[calc(100%-0.75rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <RCLineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#243554" />
              <XAxis dataKey={xKey} stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Legend />
              {series.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </RCLineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
