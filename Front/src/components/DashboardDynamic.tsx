// src/components/DashboardDynamic.tsx
import { widgetRegistry } from "./registry";
import { widgetPresets } from "./presets";

type SeriesSpec = { key: string; label?: string };
type ColumnSpec = { key: string; label: string };

export type WidgetInput = {
  id: string;
  type: keyof typeof widgetRegistry;  // "kpi" | "line" | "bar" | "table"
  title?: string;
  data?: any;
  value?: any;
  xKey?: string;
  series?: SeriesSpec[];
  columns?: ColumnSpec[];
};

export default function DashboardDynamic({ widgets }: { widgets: WidgetInput[] }) {
  return (
    <div className="p-4">
      <div className="grid grid-flow-dense grid-cols-12 gap-4">
        {widgets.map((w) => {
          const Comp = widgetRegistry[w.type];
          const preset =
            widgetPresets[w.type as keyof typeof widgetPresets] ??
            { col: "col-span-12", height: "h-auto" };

          if (!Comp) {
            return (
              <div key={w.id} className="col-span-12">
                Tipo no soportado: {String(w.type)}
              </div>
            );
          }

          // 🔑 Clave dinámica que cambia cuando cambian los datos/series/título.
          const renderKey =
            w.id +
            "|" +
            (w.title ?? "") +
            "|" +
            (Array.isArray(w.data) ? w.data.length : 0) +
            "|" +
            JSON.stringify(w.series ?? []);

          return (
            <div key={w.id} className={`${preset.col} ${preset.height} exportable-graph`} data-id={w.id}>
              <div className="w-full h-full">
                {/* Forzamos remount del widget al cambiar su contenido */}
                <Comp key={renderKey} {...w} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
