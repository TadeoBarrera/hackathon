// Importa el componente visual y los tipos desde DashboardView
import DashboardView from "../view/DashboardView";
import type { KRI } from "../view/DashboardView";
import type { ChartSpec } from "../view/ChartCard";

/** 
 * DashboardLogic: 
 * Encapsula la lógica y los datos (actualmente dummy).
 * Aquí después se conectará al backend (fetch / WebSocket).
 */
export default function DashboardLogic() {
  // --- Datos dummy ---
  const kri: KRI = {
    title: "KRI • Riesgo clave",
    value: "12,584",
    hint: "activos coincidentes",
    pct: 72,
  };

  const chart1: ChartSpec = {
    id: "c1",
    type: "line",
    title: "Demanda por hora",
    xKey: "hora",
    series: [{ key: "galletas", label: "Estimado" }],
    data: [
      { hora: "06:00", galletas: 80 },
      { hora: "07:00", galletas: 120 },
      { hora: "08:00", galletas: 150 },
      { hora: "09:00", galletas: 110 },
    ],
  };

  const chart2: ChartSpec = {
    id: "c2",
    type: "bar",
    title: "Top vuelos por consumo",
    xKey: "vuelo",
    series: [{ key: "consumo", label: "Galletas" }],
    data: [
      { vuelo: "AM123", consumo: 340 },
      { vuelo: "AM456", consumo: 290 },
      { vuelo: "AM789", consumo: 210 },
    ],
  };

  const chart3: ChartSpec = {
    id: "c3",
    type: "table",
    title: "Tabla de pedidos",
    data: [
      { vuelo: "AM123", fecha: "2025-10-24", consumo: 340, estatus: "ok" },
      { vuelo: "AM456", fecha: "2025-10-24", consumo: 290, estatus: "pendiente" },
    ],
  };

  // Renderiza el dashboard con los datos
  return <DashboardView kri={kri} charts={[chart1, chart2, chart3]} />;
}
