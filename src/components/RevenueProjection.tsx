import rawData from "../data/Resultados.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Procesamos los datos para calcular la diferencia optimizado - original
const differences = rawData.map((entry: any) => +(entry.optimizado - entry.original).toFixed(2));

// Agrupamos en 5 meses: Enero a Mayo
const monthLabels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo"];
const chunkSize = Math.ceil(differences.length / monthLabels.length);

const monthlyDiff = monthLabels.map((month, i) => {
  const chunk = differences.slice(i * chunkSize, (i + 1) * chunkSize);
  const avg = chunk.reduce((a, b) => a + b, 0) / chunk.length;
  return {
    month,
    difference: +avg.toFixed(2),
  };
});

// Tooltip personalizado sin tipos externos
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any;
  label?: string;
}) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white text-black text-xs p-2 rounded shadow border">
        <p>{label}</p>
        <p className="font-semibold">
          Beneficio: ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }

  return null;
};

export default function RevenueProjection() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Proyección de Beneficios</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Gráfica de crecimiento</h3>
        <div className="w-full h-64 bg-white border rounded">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyDiff} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) =>
                  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="difference" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <table className="w-full border rounded-md mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border">Mes</th>
            <th className="text-left p-2 border">Beneficio Promedio</th>
          </tr>
        </thead>
        <tbody>
          {monthlyDiff.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{row.month}</td>
              <td className="p-2 border">
                ${row.difference.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
