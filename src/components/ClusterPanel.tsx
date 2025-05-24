import { useEffect, useState } from "react";
import clsx from "clsx";

// Dummy data generator
const generateClusters = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    value: Math.floor(Math.random() * 50) + 1,
    color: Math.random() > 0.5 ? "red" : "blue",
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
  }));

export default function ClusterPanel() {
  const [clusters, setClusters] = useState(() => generateClusters(25));

  useEffect(() => {
    // Optional: refresh data every X seconds
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-50">
      <div className="absolute right-4 top-4 bg-white shadow-lg p-4 rounded-md border w-64 z-10">
        <h3 className="text-lg font-bold mb-2">Marker Clustering</h3>
        <p className="text-sm mb-2">
          This panel simulates clustered data points dynamically placed on a grid layout.
        </p>
        <select className="w-full p-1 border rounded text-sm">
          <option>All Types</option>
          <option>Red Only</option>
          <option>Blue Only</option>
        </select>
      </div>

      {/* Cluster markers */}
      {clusters.map((cluster) => (
        <div
          key={cluster.id}
          className={clsx(
            "absolute flex items-center justify-center text-white text-sm font-bold w-10 h-10 rounded-full shadow-md",
            cluster.color === "red" ? "bg-red-500" : "bg-blue-500"
          )}
          style={{ top: cluster.top, left: cluster.left }}
        >
          {cluster.value}
        </div>
      ))}
    </div>
  );
}
