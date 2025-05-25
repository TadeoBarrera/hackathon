// App.tsx
import { useState } from "react";
import HomePanel from "./components/HomePanel";
import ClusterPanel from "./components/charts/ClusterPanel";
import RevenueProjection from "./components/RevenueProjection";
import Propuesta from "./components/charts/Propuesta";
import Beneficios from "./components/charts/Beneficios";
import Inversion from "./components/charts/Inversion";
import OptimoVsReal from "./components/charts/OptimoVsReal";
import {
  FaHome,
  FaProjectDiagram,
  FaChartLine,
  FaMoneyBillWave,
  FaChartPie,
  FaCogs,
} from "react-icons/fa";

export default function App() {
  const [section, setSection] = useState("home");

  return (
    <main className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-[16vw] bg-white shadow-md py-6 px-4 flex flex-col justify-between border-r">
        <div>
          <div className="flex items-center space-x-3 px-2 mb-8">
            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-lg font-bold text-lg">
              P
            </div>
            <h1 className="text-xl font-semibold text-blue-600">Pro Sidebar</h1>
          </div>

          <div className="mb-6">
            <h3 className="text-xs uppercase text-gray-400 mb-2">General</h3>
            <ul className="space-y-3">
              <li
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer"
                onClick={() => setSection("home")}
              >
                <FaHome className="text-lg" />
                <span>Home</span>
              </li>
              <li
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer"
                onClick={() => setSection("projection")}
              >
                <FaChartLine className="text-lg" />
                <span>Proyección</span>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xs uppercase text-gray-400 mb-2">Clustering</h3>
            <ul className="space-y-3">
              <li
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer"
                onClick={() => setSection("cluster")}
              >
                <FaProjectDiagram className="text-lg" />
                <span>Marker Clustering</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-2">Módulos</h3>
            <ul className="space-y-3">
              <li
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer"
                onClick={() => setSection("propuesta")}
              >
                <FaChartPie className="text-lg" />
                <span>Propuesta</span>
              </li>
              <li
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer"
                onClick={() => setSection("beneficios")}
              >
                <FaMoneyBillWave className="text-lg" />
                <span>Beneficios</span>
              </li>
              <li
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer"
                onClick={() => setSection("inversion")}
              >
                <FaChartLine className="text-lg" />
                <span>Inversión</span>
              </li>
              <li
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer"
                onClick={() => setSection("optimo")}
              >
                <FaCogs className="text-lg" />
                <span>Óptimo vs Real</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Panel principal */}
      <section className="flex-1 relative p-6 overflow-y-auto bg-gray-50">
        {section === "home" && <HomePanel />}
        {section === "cluster" && <ClusterPanel />}
        {section === "projection" && <RevenueProjection />}
        {section === "propuesta" && <Propuesta />}
        {section === "beneficios" && <Beneficios />}
        {section === "inversion" && <Inversion />}
        {section === "optimo" && <OptimoVsReal />}
      </section>
    </main>
  );
}
