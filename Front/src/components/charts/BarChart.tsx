type BarChartProps = {
  title?: string;
  data?: Array<Record<string, unknown>>;
  xKey?: string;
  series?: { key: string; label?: string }[];
  layout?: "vertical" | "horizontal";
  className?: string;
};

export default function BarChart({
  title,
  className,
}: BarChartProps) {
  return (
    <div className={`w-full h-full bg-[#15243D] text-white p-3 rounded-lg ${className ?? ""}`}>
      {title && <h3 className="text-sm font-semibold mb-2">{title}</h3>}
      <div className="w-full h-[calc(100%-0.75rem)] flex items-center justify-center text-xs opacity-70">
        Gráfica de barras (placeholder)
      </div>
    </div>
  );
}
