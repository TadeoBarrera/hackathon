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

// Agrupamos en 5 meses
const months = 5;
const chunkSize = Math.ceil(differences.length / months);

const monthlyDiff = Array.from({ length: months }, (_, i) => {
  const chunk = differences.slice(i * chunkSize, (i + 1) * chunkSize);
  const avg = chunk.reduce((a, b) => a + b, 0) / chunk.length;
  return {
    month: `Mes ${i + 1}`,
    difference: +avg.toFixed(2),
  };
});

export default function RevenueProjection() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Proyección de Ganancias</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Gráfica de crecimiento</h3>
        <div className="w-full h-64 bg-white border rounded">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyDiff} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="difference" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <table className="w-full border rounded-md mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border">Mes</th>
            <th className="text-left p-2 border">Diferencia Promedio ($)</th>
          </tr>
        </thead>
        <tbody>
          {monthlyDiff.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{row.month}</td>
              <td className="p-2 border">{row.difference.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
