import React, { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import Propuesta from "./charts/Propuesta";
import ClusterPanel from "./charts/ClusterPanel";
import Beneficios from "./charts/Beneficios";
import Inversion from "./charts/Inversion";
import OptimoVsReal from "./charts/OptimoVsReal";

const availableModules = [
  { id: "optimo", label: "Óptimo vs Real", component: <OptimoVsReal mini /> },
  { id: "propuesta", label: "Propuesta", component: <Propuesta mini /> },
  { id: "cluster", label: "Cluster", component: <ClusterPanel mini count={12} /> },
  { id: "beneficios", label: "Beneficios", component: <Beneficios mini /> },
  { id: "inversion", label: "Inversión", component: <Inversion mini /> },
];

export default function HomePanel() {
  const [editMode, setEditMode] = useState(false);
  const [activeModules, setActiveModules] = useState<string[]>([
    "optimo",
    "propuesta",
    "cluster",
    "beneficios",
    "inversion",
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

  return (
    <div className="w-full p-6 bg-gradient-to-br from-[#15243D] via-[#0E4385] to-[#111827] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Resumen General</h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-xs bg-[#0E4385] hover:bg-[#1D99D6] text-white px-4 py-1 rounded shadow"
        >
          {editMode ? "Finalizar edición" : "Editar tablero"}
        </button>
      </div>

      {editMode && (
        <div className="mb-6 p-4 bg-[#15243D] rounded-xl shadow border-l-4 border-[#1D99D6]">
          <h2 className="text-sm font-semibold text-white mb-2">Selecciona los módulos a mostrar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-300">
            {availableModules.map((mod) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableModules
          .filter((mod) => activeModules.includes(mod.id))
          .map((mod) => (
            <div
              key={mod.id}
              className={`bg-[#15243D] border border-[#1D99D6] rounded-xl shadow-lg p-4 h-[220px] relative transition-all ${
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
