type KRIProps = {
  title?: string;
  value?: number | string;
  subtitle?: string;
  format?: "money" | "number" | "text";
  className?: string;
};

export default function KRI({
  title,
  value,
  subtitle,
  className,
}: KRIProps) {
  return (
    <div className={`w-full h-full bg-[#15243D] text-white p-3 rounded-lg ${className ?? ""}`}>
      {title && <h3 className="text-xs font-semibold mb-1">{title}</h3>}
      {subtitle && <p className="text-[11px] text-gray-300">{subtitle}</p>}
      <div className="w-full h-[calc(100%-1.25rem)] flex items-center justify-center">
        <span className="text-2xl font-bold">{value ?? "KPI (placeholder)"}</span>
      </div>
    </div>
  );
}
