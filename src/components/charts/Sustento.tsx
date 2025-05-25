import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const dummyData = [
  { mes: "Ene", base: 12000, ajustada: 15000 },
  { mes: "Feb", base: 14500, ajustada: 17200 },
  { mes: "Mar", base: 9800, ajustada: 11800 },
  { mes: "Abr", base: 16300, ajustada: 19100 },
  { mes: "May", base: 13400, ajustada: 16200 },
];

export default function Beneficios({
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
          Comparativo de Beneficios
        </h2>
      )}
      <ResponsiveContainer width="100%" height={mini ? 160 : 240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          {!mini && <Legend />}
          <Bar dataKey="base" fill="#60a5fa" name="Ganancia Base" />
          <Bar dataKey="ajustada" fill="#10b981" name="Ganancia Ajustada" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
