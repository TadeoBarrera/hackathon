import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import jsonData from "../../data/IntentosVsProbabilidad.json";

export default function IntentosVsProbabilidad({ mini = false }: { mini?: boolean }) {
  const [data, setData] = useState<{ intentos: number; probabilidad: number }[]>([]);

  useEffect(() => {
    const parsed = jsonData.map((d: any) => ({
      intentos: d.intentos,
      probabilidad: d["Probabilidad de Cobro"],
    }));
    setData(parsed);
  }, []);

  // ✅ Tooltip compartido
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`text-xs p-2 rounded shadow-md border ${mini ? "bg-white text-[#0E4385] border-[#1D99D6]" : "bg-[#1D99D6] text-white border-none"}`}>
          <p className="font-bold mb-1">{`Intentos: ${label}`}</p>
          <p>{`Probabilidad: ${(payload[0].value * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // ✅ MINI VERSION
  if (mini) {
    return (
      <div className="w-full h-full relative">

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 10, bottom: 20, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1D99D680" />
            <XAxis
              dataKey="intentos"
              stroke="#ffffff"
              tick={{ fontSize: 10 }}
            />
            <YAxis
              domain={[0, 0.3]}
              ticks={[0, 0.08, 0.15, 0.23, 0.3]}
              stroke="#ffffff"
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              tick={{ fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="probabilidad"
              stroke="#ffffff"
              strokeWidth={2}
              dot={{ r: 2 }}
              name="Probabilidad"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ✅ FULL VERSION
  return (
    <div className="w-full h-full flex flex-col gap-4 bg-gradient-to-br from-[#15243D] via-[#0E4385] to-[#111827] text-white p-6 rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center relative">
        <h2 className="text-3xl font-extrabold text-white text-center">
          Relación entre Intentos de Cobro y Probabilidad de Pago
        </h2>
        <p className="absolute left-12 mt-5 text-sm text-gray-300 text-justify right-12">
          Este gráfico analiza cómo varía la probabilidad de que una persona liquide su deuda en función del número de intentos de cobro realizados.
          <br /><br />
          Permite identificar el punto óptimo de insistencia para maximizar la recuperación sin incurrir en esfuerzos innecesarios.
        </p>
      </div>

      {/* Gráfico */}
      <div className="w-full mt-24 h-[300px] bg-[#15243D] p-4 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1D99D680" />
            <XAxis dataKey="intentos" stroke="#ffffff" />
            <YAxis
              stroke="#ffffff"
              domain={[0, 0.3]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="probabilidad"
              name="Probabilidad de Cobro"
              stroke="#1D99D6"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
            <ReferenceLine
              x={10}
              stroke="#ffffff"
              strokeDasharray="4 3"
              label={{
                value: "Intento 10",
                position: "top",
                fill: "#ffffff",
                fontSize: 12,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Nota */}
      <div className="text-center text-[#FFFFFF] text-sm font-medium">
        *A partir del intento 10, la probabilidad se reduce drásticamente a menos del 10%.
      </div>
    </div>
  );
}
