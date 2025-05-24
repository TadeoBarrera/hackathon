import { useState } from "react";
import clsx from "clsx";

const generateClusters = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    value: Math.floor(Math.random() * 50) + 1,
    color: Math.random() > 0.5 ? "red" : "blue",
    top: `${Math.random() * 85 + 5}%`,
    left: `${Math.random() * 85 + 5}%`,
  }));

export default function ClusterPanel() {
  const [clusters, setClusters] = useState(() => generateClusters(30));
  const [filter, setFilter] = useState("All");

  const filteredClusters = clusters.filter((c) => {
    if (filter === "All") return true;
    return c.color === filter.toLowerCase();
  });

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* Floating panel */}
      <div className="absolute right-6 top-6 bg-white shadow-xl p-5 rounded-xl border border-gray-200 w-72 z-10">
        <h3 className="text-xl font-semibold mb-2">Marker Clustering</h3>
        <p className="text-sm text-gray-600 mb-3 leading-tight">
          This panel simulates clustered data points dynamically placed on a grid layout.
        </p>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border rounded-md text-sm bg-white"
        >
          <option>All</option>
          <option>Red</option>
          <option>Blue</option>
        </select>
      </div>

      {/* Cluster markers */}
      {filteredClusters.map((cluster) => {
        const isBlue = cluster.color === "blue";
        const baseColor = isBlue ? "#1d4ed8" : "#dc2626";
        const ring1 = isBlue ? "#3b82f6" : "#f87171";
        const ring2 = isBlue ? "#93c5fd" : "#fca5a5";
        const ring3 = isBlue ? "#dbeafe" : "#fecaca";

        return (
          <div
            key={cluster.id}
            className="absolute flex items-center justify-center"
            style={{
              top: cluster.top,
              left: cluster.left,
              width: "60px",
              height: "60px",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Outer Rings */}
            <div className="absolute w-full h-full flex items-center justify-center z-0 pointer-events-none">
              <div
                className="absolute rounded-full"
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: ring3,
                  opacity: 0.4,
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: ring2,
                  opacity: 0.5,
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: ring1,
                  opacity: 0.6,
                }}
              />
            </div>

            {/* Main Cluster */}
            <div
              className="relative z-10 flex items-center justify-center text-white text-sm font-bold w-10 h-10 rounded-full shadow-lg"
              style={{
                backgroundColor: baseColor,
                border: `2px solid ${ring2}`,
              }}
            >
              {cluster.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
