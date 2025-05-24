import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const generateClusters = (count: number) =>
  Array.from({ length: count }, (_, i) => {
    const value = Math.floor(Math.random() * 50) + 1;
    const types = ["A", "B", "C"];
    const statuses = ["active", "inactive"];
    const size = value > 40 ? "large" : value > 20 ? "medium" : "small";

    return {
      id: i + 1,
      value,
      color: Math.random() > 0.5 ? "red" : "blue",
      top: `${Math.random() * 85 + 5}%`,
      left: `${Math.random() * 85 + 5}%`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      size,
    };
  });

export default function ClusterPanel({ mini = false, count = 30 }) {
  const [clusters] = useState(() => generateClusters(count));
  const [colorFilter, setColorFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredClusters = clusters.filter((c) => {
    const colorMatch = colorFilter === "All" || c.color === colorFilter.toLowerCase();
    const typeMatch = typeFilter === "All" || c.type === typeFilter;
    const statusMatch = statusFilter === "All" || c.status === statusFilter;
    return colorMatch && typeMatch && statusMatch;
  });

  return (
    <div
      className={`relative overflow-hidden ${
        mini ? "w-full h-full rounded-lg" : "w-full h-screen"
      }`}
      style={{
        backgroundImage:
          "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "40px 40px",
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
            This panel simulates clustered data points dynamically placed on a grid layout.
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
          const isBlue = cluster.color === "blue";
          const baseColor = isBlue ? "#1d4ed8" : "#dc2626";
          const ring1 = isBlue ? "#3b82f6" : "#f87171";
          const ring2 = isBlue ? "#93c5fd" : "#fca5a5";
          const ring3 = isBlue ? "#dbeafe" : "#fecaca";

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
                transform: "translate(-50%, -50%)",
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
