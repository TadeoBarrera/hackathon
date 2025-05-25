const dummyData = [
  { nombre: "Marketing", monto: "$5,000", fecha: "2024-03-15" },
  { nombre: "Tecnología", monto: "$8,500", fecha: "2024-03-20" },
  { nombre: "Talento", monto: "$4,200", fecha: "2024-03-25" },
];

export default function Inversion({
  data = dummyData,
  mini = false,
}: {
  data?: typeof dummyData;
  mini?: boolean;
}) {
  const visibleRows = mini ? data.slice(0, 3) : data;

  return (
    <div className="w-full h-full">
      {!mini && (
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Inversión</h2>
      )}
      <div className={`${mini ? "overflow-hidden" : "overflow-y-auto"} max-h-full`}>
        <table className="w-full text-left text-xs text-gray-700">
          <thead>
            <tr className="border-b">
              <th className="py-1">Área</th>
              <th className="py-1">Monto</th>
              <th className="py-1">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-1">{item.nombre}</td>
                <td className="py-1">{item.monto}</td>
                <td className="py-1">{item.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {mini && data.length > 3 && (
          <p className="text-[10px] text-gray-400 mt-1 italic">+ {data.length - 3} más</p>
        )}
      </div>
    </div>
  );
}
