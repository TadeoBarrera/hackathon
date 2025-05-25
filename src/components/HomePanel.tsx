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
    <div className="w-full p-4 pr-6 bg-gray-50 text-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Resumen General</h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {editMode ? "Finalizar edición" : "Editar tablero"}
        </button>
      </div>

      {editMode && (
        <div className="mb-4 p-4 bg-white rounded-xl shadow border">
          <h2 className="text-sm font-semibold mb-2">Selecciona los módulos a mostrar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {availableModules.map((mod) => (
              <label key={mod.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={activeModules.includes(mod.id)}
                  onChange={() => toggleModule(mod.id)}
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
              className={`bg-white rounded-xl shadow p-3 h-[220px] relative ${
                wideModules.includes(mod.id) ? "col-span-full md:col-span-2 w-full" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-sm font-semibold text-gray-700">{mod.label}</h2>
                <button
                  onClick={() => toggleWide(mod.id)}
                  className="z-20 p-1 rounded-full hover:bg-gray-100"
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
