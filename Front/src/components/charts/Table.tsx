type TableProps = {
  title?: string;
  data?: any[];
  columns?: { key: string; label: string }[];
  className?: string;
};

export default function Table({
  title,
  data = [],
  columns = [],
  className,
}: TableProps) {
  const hasData = Array.isArray(data) && data.length > 0 && columns.length > 0;

  return (
    <div className={`w-full h-full bg-[#15243D] text-white p-3 rounded-lg ${className ?? ""}`}>
      {title && <h3 className="text-sm font-semibold mb-2">{title}</h3>}

      {!hasData ? (
        <div className="w-full h-[calc(100%-0.75rem)] overflow-auto text-xs opacity-70 flex items-center justify-center">
          Tabla (sin datos)
        </div>
      ) : (
        <div className="w-full h-[calc(100%-0.75rem)] overflow-auto text-xs">
          <table className="min-w-full">
            <thead className="text-gray-300">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="text-left px-3 py-2 whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={i} className="border-t border-white/10">
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-2 whitespace-nowrap">
                      {String((r as any)[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
