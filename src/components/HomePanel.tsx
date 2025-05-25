import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Beneficios from "./charts/Beneficios";
import Cobranza from "./charts/Cobranza";
import OptimoVsReal from "./charts/OptimoVsReal";

const availableModules = [
  { id: "optimo", label: "Óptimo vs Real", component: <OptimoVsReal mini /> },
  { id: "beneficios", label: "Beneficios", component: <Beneficios mini /> },
  { id: "cobranza_prob", label: "Cobranza - Probabilidad", component: <Cobranza mini variant="probabilidad" /> },
  { id: "cobranza_valor", label: "Cobranza - Valor Esperado", component: <Cobranza mini variant="valor" /> },
];

const availableKpis = [
  {
    id: "kpi_negativo",
    label: "Valor Esperado Negativo",
    component: (
      <div className="exportable-graph bg-[#15243D] border border-[#1D99D6] rounded-xl shadow p-4 text-white flex items-center justify-center text-center">
        <span className="text-sm">
          A partir del intento <span className="font-semibold text-[#1D99D6]">20</span>, el valor esperado es{" "}
          <span className="font-semibold text-red-400">negativo</span>.
        </span>
      </div>
    ),
  },
  {
    id: "kpi_ganancia",
    label: "Ganancia Potencial",
    component: (
      <div className="exportable-graph bg-[#15243D] border border-[#1D99D6] rounded-xl shadow p-4 text-white flex flex-col justify-center items-center">
        <span className="text-sm text-gray-300">Ganancia potencial adicional</span>
        <span className="text-2xl font-bold text-[#1D99D6] mt-1">$25,000,000</span>
      </div>
    ),
  },
  {
    id: "kpi_boton",
    label: "Botón Recomendaciones",
    component: (
      <div className="exportable-graph bg-[#15243D] border border-[#1D99D6] rounded-xl shadow p-4 flex items-center justify-center">
        <button
          className="bg-[#0E4385] hover:bg-[#1D99D6] text-white text-sm px-5 py-2 rounded shadow transition-colors duration-300"
          onClick={() => alert("Mostrando recomendaciones...")}
        >
          Ver recomendaciones
        </button>
      </div>
    ),
  },
];

export default function HomePanel() {
  const [editMode, setEditMode] = useState(false);
  const [activeModules, setActiveModules] = useState<string[]>([
    "optimo",
    "beneficios",
    "cobranza_prob",
    "cobranza_valor",
    "kpi_negativo",
    "kpi_ganancia",
    "kpi_boton",
  ]);
  const [wideModules, setWideModules] = useState<string[]>([]);

  const toggleModule = (id: string) => {
    setActiveModules((prev) =>
      prev.includes(id) ? prev.filter((mod) => mod !== id) : [...prev, id]
    );
  };

  const toggleWide = (id: string) => {
    setWideModules((prev) =>
      prev.includes(id) ? prev.filter((mod) => mod !== id) : [...prev, id]
    );
  };

  const visibleKpis = availableKpis.filter((k) => activeModules.includes(k.id));
  const visibleModules = availableModules.filter((m) => activeModules.includes(m.id));

  const exportDashboardToPDF = async () => {
    const elements = document.querySelectorAll(".exportable-graph");

    const pdf = new jsPDF("p", "pt", "a4");
    let yOffset = 20;

    for (const element of elements) {
      const canvas = await html2canvas(element as HTMLElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (yOffset + pdfHeight > pdf.internal.pageSize.getHeight()) {
        pdf.addPage();
        yOffset = 20;
      }

      pdf.addImage(imgData, "PNG", 20, yOffset, pdfWidth, pdfHeight);
      yOffset += pdfHeight + 20;
    }

    pdf.save("dashboard.pdf");
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-[#15243D] via-[#0E4385] to-[#111827] text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-white text-center">Resumen General</h1>
        <div className="flex gap-3">
          <button
            onClick={exportDashboardToPDF}
            className="text-xs bg-[#0E4385] hover:bg-[#1D99D6] text-white px-4 py-1 rounded shadow"
          >
            Descargar PDF
          </button>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-xs bg-[#1F2937] hover:bg-[#1D99D6] text-white px-4 py-1 rounded shadow"
          >
            {editMode ? "Finalizar edición" : "Editar tablero"}
          </button>
        </div>
      </div>

      {/* Panel de selección */}
      {editMode && (
        <div className="mb-6 p-4 bg-[#15243D] rounded-xl shadow border-l-4 border-[#1D99D6]">
          <h2 className="text-sm font-semibold text-white mb-2">Selecciona los módulos a mostrar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-300">
            {[...availableModules, ...availableKpis].map((mod) => (
              <label key={mod.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={activeModules.includes(mod.id)}
                  onChange={() => toggleModule(mod.id)}
                  className="accent-[#1D99D6]"
                />
                <span>{mod.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* KPIs */}
      {visibleKpis.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {visibleKpis.map((kpi) => (
            <div key={kpi.id} className="exportable-graph">{kpi.component}</div>
          ))}
        </div>
      )}

      {/* Módulos mini */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleModules.map((mod) => (
          <div
            key={mod.id}
            className={`exportable-graph bg-[#15243D] border border-[#1D99D6] rounded-xl shadow-lg p-4 h-[220px] relative transition-all ${
              wideModules.includes(mod.id) ? "col-span-full md:col-span-2 w-full" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-sm font-semibold text-white">{mod.label}</h2>
              <button
                onClick={() => toggleWide(mod.id)}
                className="z-20 p-1 rounded-full hover:bg-[#1D99D6]/20 text-white"
              >
                {wideModules.includes(mod.id) ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
            {mod.component}
          </div>
        ))}
      </div>
    </div>
  );
}
