import diagramaImg from "../../assets/diagrama.jpg";

export default function Sustento({ mini = false }: { mini?: boolean }) {
  const Table = () => (
    <div className="h-[90%] overflow-x-auto rounded-lg ">
      <table className="min-w-full text-xs text-white text-center">
        <thead>
          <tr className="border-b border-[#1D99D6]">
            <th className="px-2 py-1">Clase</th>
            <th className="px-2 py-1">Precisión</th>
            <th className="px-2 py-1">Recall</th>
            <th className="px-2 py-1">F1-score</th>
            <th className="px-2 py-1">Soporte</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1">No Pagado</td>
            <td>0.97</td>
            <td>1.00</td>
            <td>0.99</td>
            <td>3234</td>
          </tr>
          <tr>
            <td className="py-1">Pagado</td>
            <td>1.00</td>
            <td>0.96</td>
            <td>0.98</td>
            <td>2085</td>
          </tr>
          <tr className="border-t border-[#1D99D6]">
            <td className="py-1 font-semibold">Accuracy</td>
            <td colSpan={4}>0.98 (5319 muestras)</td>
          </tr>
          <tr>
            <td className="py-1">Macro Promedio</td>
            <td>0.99</td>
            <td>0.98</td>
            <td>0.98</td>
            <td>5319</td>
          </tr>
          <tr>
            <td className="py-1">Weighted Promedio</td>
            <td>0.98</td>
            <td>0.98</td>
            <td>0.98</td>
            <td>5319</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

if (mini) {
  return (
      <Table />
  );
}


  return (
    <div className="w-full h-full flex flex-col gap-4 bg-gradient-to-br from-[#15243D] via-[#0E4385] to-[#111827] text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-white text-center">Sustento del Modelo</h2>

      <Table />

      <img
        src={diagramaImg}
        alt="Diagrama del modelo"
        className="max-w-md mx-auto mt-4 rounded shadow-lg"
      />

      <p className="text-xs text-gray-300 text-center italic mt-2">
        El modelo usa una arquitectura basada en atención para analizar secuencias de intentos de cobro.
      </p>
    </div>
  );
}
