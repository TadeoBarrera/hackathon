import { useEffect, useState } from "react";
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
import jsonData from "../../PRUEBA.json";

const months = ["Ene", "Feb", "Mar", "Abr", "May"];

export default function OptimoVsReal({ mini = false }: { mini?: boolean }) {
  const [data, setData] = useState<{ mes: string; real: number; optimo: number }[]>([]);

  useEffect(() => {
    const totalValues = jsonData.length;
    const perMonth = totalValues / 5;
    const parsedData = months.map((mes, i) => {
      const start = Math.floor(i * perMonth);
      const end = Math.floor((i + 1) * perMonth);
      const slice = jsonData.slice(start, end);
      const real = slice.reduce((sum, d) => sum + d.montoAcumulado, 0);
      const optimo = slice.reduce((sum, d) => sum + d.montoAcumulado2, 0);
      return { mes, real, optimo };
    });
    setData(parsedData);
  }, []);

  if (mini) {
    return (
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="real" stroke="#0E4385" dot={false} strokeWidth={2} />
          <Line
            type="monotone"
            dataKey="optimo"
            stroke="#1D99D6"
            dot={false}
            strokeDasharray="4 2"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  const totalReal = data.reduce((sum, d) => sum + d.real, 0);
  const totalOptimo = data.reduce((sum, d) => sum + d.optimo, 0);
  const delta = totalOptimo - totalReal;

  // ✅ Función para formatear montos de forma legible
  const formatCurrency = (v: number) => {
    if (v >= 1e9) return `$${(v / 1e9).toFixed(0)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`;
    if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
    return `$${v.toFixed(0)}`;
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 bg-gradient-to-br from-[#15243D] via-[#0E4385] to-[#111827] text-white p-6 rounded-xl shadow-lg">

     

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white text-center">
          Impacto de la Estrategia Óptima en la Ganancia
        </h2>
  <p className="absolute left-12 mt-5 text-sm text-gray-300 text-justify ">
    Este gráfico muestra la comparación entre la ganancia acumulada real y la ganancia
    estimada si se hubiera aplicado la estrategia óptima a lo largo del año.
  </p>
      </div>

      {/* Chart */}
      <div className="w-full mt-8 h-[300px] bg-[#15243D] p-4 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1D99D680" />
            <XAxis dataKey="mes" stroke="#ffffff" />
            <YAxis
              stroke="#ffffff"
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1D99D6", border: "none", color: "white" }}
              formatter={(v: number) => formatCurrency(v)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="real"
              stroke="#FFFFFF"
              name="Ganancia Real"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="optimo"
              stroke="#1D99D6"
              name="Ganancia Óptima"
              strokeDasharray="4 2"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
 {/* Highlight */}
      <div className="text-xl text-gray-300 text-center">
        <strong className="text-white text-2xl">Ganancia adicional potencial:</strong>{" "}
        <span className="text-[#1D99D6] font-semibold text-2xl">
{delta.toLocaleString()}
        </span>
      </div>
      {/* Insights & Actions */}
      <div className="bg-[#15243D] p-5 rounded-lg shadow-lg border-l-4 border-[#1D99D6]">
        <h3 className="text-sm font-semibold text-white mb-2">Oportunidades de Mejora</h3>
        <ul className="list-disc text-sm text-gray-300 pl-5 space-y-1">
          <li>Se detectaron desviaciones en marzo y abril respecto al rendimiento óptimo.</li>
          <li>Asignación incorrecta de estrategia en clientes con perfil alto.</li>
          <li>Se recomienda redistribuir esfuerzos hacia instituciones bancarias de mayor recuperación.</li>
        </ul>
        <button
          className="mt-3 px-5 py-2 bg-[#0E4385] hover:bg-[#1D99D6] transition-colors duration-300 text-white text-sm rounded shadow-md"
          onClick={() => alert("Aplicando acciones recomendadas (modo demo)...")}
        >
          Aplicar solución recomendada
        </button>
      </div>
    </div>
  );
}
