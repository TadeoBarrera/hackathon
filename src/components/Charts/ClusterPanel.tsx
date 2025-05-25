import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clusterData from "../../data/clusters.json";

export default function ClusterPanel({ mini = false }) {
  const [clusters, setClusters] = useState([]);
  const [colorFilter, setColorFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const parsed = [];
    const allX = [], allY = [];
    const PADDING = 0.05;

    Object.values(clusterData).forEach((cluster) => {
      allX.push(...cluster.x);
      allY.push(...cluster.y);
    });

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);

    const scale = (val, min, max) =>
      (val - min) / (max - min) * (1 - 2 * PADDING) + PADDING;

    Object.entries(clusterData).forEach(([clusterName, data], clusterIdx) => {
      data.x.forEach((x, i) => {
        const y = data.y[i];
        const propor = data.propor[i];

        const normX = scale(x, minX, maxX);
        const normY = scale(y, minY, maxY);

        parsed.push({
          id: `${clusterName}-${i}`,
          cluster: clusterName,
          value: +(propor * 100).toFixed(1),
          color: ["red", "blue", "green", "purple"][clusterIdx % 4],
          type: ["A", "B", "C"][i % 3],
          status: i % 2 === 0 ? "active" : "inactive",
          top: `calc(${(1 - normY) * 100}% - 30px)`,
          left: `calc(${normX * 100}% - 30px)`,
        });
      });
    });

    setClusters(parsed);
  }, []);

  const filteredClusters = clusters.filter((c) => {
    const colorMatch = colorFilter === "All" || c.color === colorFilter.toLowerCase();
    const typeMatch = typeFilter === "All" || c.type === typeFilter;
    const statusMatch = statusFilter === "All" || c.status === statusFilter;
    return colorMatch && typeMatch && statusMatch;
  });

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "calc(100% / 20) calc(100% / 20)",
      }}
    >
      {/* Floating panel */}
      {!mini && (
        <motion.div
          drag
          dragConstraints={{ top: 0, left: 0, right: 1000, bottom: 800 }}
          dragElastic={0.2}
          className="absolute top-6 left-6 bg-white shadow-xl p-5 rounded-xl border border-gray-200 w-72 z-50 cursor-move"
        >
          <h3 className="text-xl font-semibold mb-2">Marker Clustering</h3>
          <p className="text-sm text-gray-600 mb-3 leading-tight">
            This panel uses external data points and filters them dynamically.
          </p>

          <div className="space-y-2">
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="w-full p-2 border rounded-md text-sm bg-white"
            >
              <option>All</option>
              <option>Red</option>
              <option>Blue</option>
              <option>Green</option>
              <option>Purple</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 border rounded-md text-sm bg-white"
            >
              <option>All</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-md text-sm bg-white"
            >
              <option>All</option>
              <option>active</option>
              <option>inactive</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Cluster markers */}
      <AnimatePresence>
        {filteredClusters.map((cluster) => {
          const baseColor = {
            red: "#dc2626",
            blue: "#1d4ed8",
            green: "#059669",
            purple: "#7c3aed",
          }[cluster.color];

          const ring1 = {
            red: "#f87171",
            blue: "#3b82f6",
            green: "#34d399",
            purple: "#c084fc",
          }[cluster.color];

          const ring2 = {
            red: "#fca5a5",
            blue: "#93c5fd",
            green: "#6ee7b7",
            purple: "#d8b4fe",
          }[cluster.color];

          const ring3 = {
            red: "#fecaca",
            blue: "#dbeafe",
            green: "#bbf7d0",
            purple: "#ede9fe",
          }[cluster.color];

          return (
            <motion.div
              key={cluster.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4 }}
              className="absolute flex items-center justify-center"
              style={{
                top: cluster.top,
                left: cluster.left,
                width: "60px",
                height: "60px",
              }}
            >
              {/* Animated halos */}
              <div className="absolute w-full h-full flex items-center justify-center z-0 pointer-events-none">
                {[ring3, ring2, ring1].map((ring, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute rounded-full"
                    style={{
                      width: `${60 - idx * 20}px`,
                      height: `${60 - idx * 20}px`,
                      backgroundColor: ring,
                      opacity: 0.4 + idx * 0.1,
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: idx * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Main cluster */}
              <div
                className="relative z-10 flex items-center justify-center text-white text-sm font-bold w-10 h-10 rounded-full shadow-lg"
                style={{
                  backgroundColor: baseColor,
                  border: `2px solid ${ring2}`,
                }}
              >
                {cluster.value}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
