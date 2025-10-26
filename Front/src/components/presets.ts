export type WidgetType = "kpi" | "line" | "bar" | "table";

export const widgetPresets: Record<WidgetType, { col: string; height: string }> = {
  kpi:   { col: "col-span-12", height: "h-[100px]" },
  line:  { col: "col-span-12 md:col-span-6", height: "h-[300px]" },
  bar:   { col: "col-span-12 md:col-span-6", height: "h-[300px]" },
  table: { col: "col-span-12",              height: "max-h-[500px]" },
};
