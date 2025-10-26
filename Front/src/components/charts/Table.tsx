type TableProps = {
  title?: string;
  data?: any[]; // placeholder
  columns?: { key: string; label: string }[];
  className?: string;
};

export default function Table({
  title,
  className,
}: TableProps) {
  return (
    <div className={`w-full h-full bg-[#15243D] text-white p-3 rounded-lg ${className ?? ""}`}>
      {title && <h3 className="text-sm font-semibold mb-2">{title}</h3>}
      <div className="w-full h-[calc(100%-0.75rem)] overflow-auto text-xs opacity-70 flex items-center justify-center">
        Tabla (placeholder)
      </div>
    </div>
  );
}
