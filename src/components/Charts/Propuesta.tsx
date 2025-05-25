import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#ef4444", "#facc15"];

const dummyData = [
  { name: "Aceptadas", value: 400 },
  { name: "Rechazadas", value: 100 },
  { name: "Pendientes", value: 300 },
];

export default function Propuesta({
  data = dummyData,
  mini = false,
}: {
  data?: typeof dummyData;
  mini?: boolean;
}) {
  const chart = (
    <ResponsiveContainer width="100%" height={mini ? 140 : 200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={mini ? 40 : 60}
          label={!mini}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="w-full h-full">
      {!mini && (
        <>
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Propuesta</h2>
          <p className="text-xs text-gray-500 mb-2">
            Distribución de propuestas según su estado actual en el sistema.
          </p>
        </>
      )}
      {chart}
    </div>
  );
}
