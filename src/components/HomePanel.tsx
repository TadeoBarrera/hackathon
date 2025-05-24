import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import ClusterPanel from "./ClusterPanel";

const pieData = [
  { name: "Aceptadas", value: 400 },
  { name: "Rechazadas", value: 100 },
  { name: "Pendientes", value: 300 },
];

const benefitData = [
  { mes: "Ene", beneficios: 12000 },
  { mes: "Feb", beneficios: 14500 },
  { mes: "Mar", beneficios: 9800 },
  { mes: "Abr", beneficios: 16300 },
  { mes: "May", beneficios: 13400 },
];

const investmentData = [
  { nombre: "Marketing", monto: "$5,000", fecha: "2024-03-15" },
  { nombre: "Tecnología", monto: "$8,500", fecha: "2024-03-20" },
  { nombre: "Talento", monto: "$4,200", fecha: "2024-03-25" },
];

const COLORS = ["#22c55e", "#ef4444", "#facc15"];

const HomePanel = () => {
  return (
    <div className="h-screen w-full p-4 pr-6 overflow-hidden grid grid-cols-2 grid-rows-2 gap-4 text-sm bg-gray-50">
      {/* Propuesta */}
      <div className="bg-white rounded-xl shadow p-3 flex flex-col">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Propuesta</h2>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={50}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cluster */}
      <div className="bg-white rounded-xl shadow p-3 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-gray-700">Cluster</h2>
          <a
            href="/cluster-view"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Ver más
          </a>
        </div>
        <div className="flex-1 rounded-lg overflow-hidden border">
          <ClusterPanel mini count={16} />
        </div>
      </div>

      {/* Beneficios */}
      <div className="bg-white rounded-xl shadow p-3 flex flex-col">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Beneficios</h2>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benefitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="beneficios" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inversión */}
      <div className="bg-white rounded-xl shadow p-3 flex flex-col">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Inversión</h2>
        <div className="flex-1 overflow-hidden">
          <table className="w-full text-left text-xs text-gray-700">
            <thead>
              <tr className="border-b">
                <th className="py-1">Área</th>
                <th className="py-1">Monto</th>
                <th className="py-1">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {investmentData.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-1">{item.nombre}</td>
                  <td className="py-1">{item.monto}</td>
                  <td className="py-1">{item.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePanel;
