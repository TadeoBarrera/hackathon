import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const dummyData = [
  { mes: "Ene", real: 45000, optimo: 63000 },
  { mes: "Feb", real: 42000, optimo: 60000 },
  { mes: "Mar", real: 47000, optimo: 67000 },
  { mes: "Abr", real: 51000, optimo: 70000 },
  { mes: "May", real: 49000, optimo: 68000 },
];

export default function OptimoVsReal({
  data = dummyData,
  mini = false,
}: {
  data?: typeof dummyData;
  mini?: boolean;
}) {
  return (
    <div className="w-full h-full">
      {!mini && (
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Impacto de la Estrategia Óptima en la Ganancia
        </h2>
      )}
      <ResponsiveContainer width="100%" height={mini ? 160 : 240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          {!mini && <Legend />}
          <Line
            type="monotone"
            dataKey="real"
            stroke="#3b82f6"
            name="Ganancia Real"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="optimo"
            stroke="#10b981"
            name="Ganancia Óptima"
            strokeDasharray="4 2"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
