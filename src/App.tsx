// App.tsx
import { useState } from "react";
import ClusterPanel from "./components/ClusterPanel";
import HomePanel from "./components/HomePanel";
import RevenueProjection from "./components/RevenueProjection";
import { FaHome, FaProjectDiagram, FaChartLine } from "react-icons/fa";

export default function App() {
  const [section, setSection] = useState("home");

  return (
    <main className="min-h-screen bg-white flex">
      <aside className="w-[16vw] bg-white shadow-md py-6 px-4 flex flex-col justify-between border-r">
        <div>
          <div className="flex items-center space-x-3 px-2 mb-8">
            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-lg font-bold text-lg">P</div>
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

          <div>
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
        </div>
      </aside>

      <section className="flex-1 relative">
        {section === "home" && <HomePanel />}
        {section === "cluster" && <ClusterPanel />}
        {section === "projection" && <RevenueProjection />}
      </section>
    </main>
  );
}
