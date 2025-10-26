import { widgetRegistry } from "./registry";
import { widgetPresets } from "./presets";

type SeriesSpec = { key: string; label?: string };
type ColumnSpec = { key: string; label: string };

// Lo mínimo que cualquier widget podría recibir
export type WidgetInput = {
  id: string;
  type: keyof typeof widgetRegistry;   // "kpi" | "line" | "bar" | "table"
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
      <div className="grid grid-cols-12 gap-4">
        {widgets.map((w) => {
          const Comp = widgetRegistry[w.type];
          const preset = widgetPresets[w.type as keyof typeof widgetPresets] ?? { col: "col-span-12", height: "h-auto" };

          if (!Comp) {
            return (
              <div key={w.id} className="col-span-12">
                Tipo no soportado: {String(w.type)}
              </div>
            );
          }

          return (
            <div key={w.id} className={`${preset.col} ${preset.height} exportable-graph`} data-id={w.id}>
              <div className="w-full h-full">
                <Comp {...w} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
