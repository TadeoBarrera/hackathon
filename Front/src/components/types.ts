export type ChartType = "line" | "bar" | "table";
export type Row = Record<string, string | number | null>;

export interface ChartSpec {
  id: string;
  type: ChartType;
  title?: string;
  data: Row[];
  xKey?: string;
  series?: { key: string; label?: string }[];
}

export interface PanelSpec { id: string; chart: ChartSpec; }
export interface DashboardSpec { id: string; title?: string; panels: PanelSpec[]; }
