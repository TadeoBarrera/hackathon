import {
  ResponsiveContainer,
  BarChart as RCBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

type BarChartProps = {
  title?: string;
  data?: Array<Record<string, unknown>>;
  xKey?: string;
  series?: { key: string; label?: string }[];
  layout?: "vertical" | "horizontal";
  className?: string;
};

export default function BarChart({
  title,
  data = [],
  xKey = "x",
  series = [{ key: "p" }],
  layout = "horizontal",
  className,
}: BarChartProps) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className={`w-full h-full bg-[#15243D] text-white p-3 rounded-lg ${className ?? ""}`}>
      {title && <h3 className="text-sm font-semibold mb-2">{title}</h3>}

      {!hasData ? (
        <div className="w-full h-[calc(100%-0.75rem)] flex items-center justify-center text-xs opacity-70">
          Gráfica de barras (sin datos)
        </div>
      ) : (
        <div className="w-full h-[calc(100%-0.75rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <RCBarChart
              data={data}
              layout={layout === "vertical" ? "vertical" : "horizontal"}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#243554" />
              {layout === "vertical" ? (
                <>
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis type="category" dataKey={xKey} stroke="#9CA3AF" width={90} />
                </>
              ) : (
                <>
                  <XAxis dataKey={xKey} stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                </>
              )}
              <Tooltip />
              <Legend />
              {series.map((s) => (
                <Bar key={s.key} dataKey={s.key} />
              ))}
            </RCBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
