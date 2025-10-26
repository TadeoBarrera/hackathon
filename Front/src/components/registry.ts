import type { WidgetType } from "./presets";

import LineChart from "./charts/LineChart";
import BarChart  from "./charts/BarChart";
import Table     from "./charts/Table";
import KRI       from "./charts/KRI";

// Cada entry es un React component
export const widgetRegistry: Record<WidgetType, React.ComponentType<any>> = {
  line: LineChart,
  bar:  BarChart,
  table: Table,
  kpi:  KRI,
};
