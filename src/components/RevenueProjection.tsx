// components/RevenueProjection.tsx
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueProjection() {
  const [sales, setSales] = useState(1000);
  const [growthRate, setGrowthRate] = useState(10);
  const [months, setMonths] = useState(6);

  const projections = Array.from({ length: months }, (_, i) => {
    return {
      month: `Mes ${i + 1}`,
      value: +(sales * Math.pow(1 + growthRate / 100, i)).toFixed(2),
    };
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Proyección de Ganancias</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">Ventas iniciales ($)</label>
          <input
            type="number"
            value={sales}
            onChange={(e) => setSales(Number(e.target.value))}
            className="w-full p-2 mt-1 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Crecimiento mensual (%)</label>
          <input
            type="number"
            value={growthRate}
            onChange={(e) => setGrowthRate(Number(e.target.value))}
            className="w-full p-2 mt-1 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Meses</label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full p-2 mt-1 border rounded-md"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Gráfica de crecimiento</h3>
        <div className="w-full h-64 bg-white border rounded">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projections} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <table className="w-full border rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border">Mes</th>
            <th className="text-left p-2 border">Ganancia Proyectada ($)</th>
          </tr>
        </thead>
        <tbody>
          {projections.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{row.month}</td>
              <td className="p-2 border">{row.value.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
