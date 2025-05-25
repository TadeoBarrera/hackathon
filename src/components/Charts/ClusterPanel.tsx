import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clusterData from "../../data/clusters.json";

interface ClusterPoint {
  id: string;
  cluster: string;
  value: number;
  color: string;
  type: string;
  status: string;
  topPercent: number;
  leftPercent: number;
  propor: number;
}

interface ClusterCenter {
  leftPercent: number;
  topPercent: number;
  propor: number;
}

interface ClusterPanelProps {
  mini?: boolean;
}

const bankImages: Record<string, string> = {
  cluster0: "/src/assets/banamex.png",
  cluster1: "/src/assets/banorte.png",
  cluster2: "/src/assets/bbva.png",
  cluster3: "/src/assets/santander.png",
};

const clusterBankMap: Record<string, string> = {
  cluster0: "red",
  cluster1: "green",
  cluster2: "blue",
  cluster3: "purple",
};

export default function ClusterPanel({ mini = false }: ClusterPanelProps) {
  const [clusters, setClusters] = useState<ClusterPoint[]>([]);
  const [clusterCenters, setClusterCenters] = useState<Record<string, ClusterCenter>>({});
  const [colorFilter, setColorFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const imageRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
    const parsed: ClusterPoint[] = [];
    const allX: number[] = [], allY: number[] = [];
    const PADDING = 0.15;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values(clusterData).forEach((cluster: any) => {
      allX.push(...cluster.x);
      allY.push(...cluster.y);
    });

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);

    const scale = (val: number, min: number, max: number) =>
      ((val - min) / (max - min)) * (1 - 2 * PADDING) + PADDING;

    const centers: Record<string, ClusterCenter> = {};

    Object.entries(clusterData).forEach(([clusterName, data]) => {
      const xValues = data.x.map((x) => scale(x, minX, maxX));
      const yValues = data.y.map((y) => scale(y, minY, maxY));
      const avgX = xValues.reduce((a, b) => a + b, 0) / xValues.length;
      const avgY = yValues.reduce((a, b) => a + b, 0) / yValues.length;
      const meanPropor = data.propor.reduce((a, b) => a + b, 0) / data.propor.length;

      centers[clusterName] = {
        leftPercent: avgX * 100,
        topPercent: (1 - avgY) * 100,
        propor: meanPropor,
      };

      data.x.forEach((x, i) => {
        const y = data.y[i];
        const propor = data.propor[i];

        const normX = scale(x, minX, maxX);
        const normY = scale(y, minY, maxY);

        parsed.push({
          id: `${clusterName}-${i}`,
          cluster: clusterName,
          value: +(propor * 100).toFixed(1),
          color: clusterBankMap[clusterName] ?? "gray",
          type: ["A", "B", "C"][i % 3],
          status: i % 2 === 0 ? "active" : "inactive",
          topPercent: (1 - normY) * 100,
          leftPercent: normX * 100,
          propor,
        });
      });
    });

    setClusters(parsed);
    setClusterCenters(centers);
  }, []);

  const filteredClusters = clusters.filter((c) => {
    const colorMatch = colorFilter === "All" || c.color === colorFilter.toLowerCase();
    const typeMatch = typeFilter === "All" || c.type === typeFilter;
    const statusMatch = statusFilter === "All" || c.status === statusFilter;
    return colorMatch && typeMatch && statusMatch;
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "calc(100% / 20) calc(100% / 20)",
      }}
    >
      {!mini && (
        <motion.div
          drag
          dragConstraints={{ top: 0, left: 0, right: 1000, bottom: 800 }}
          dragElastic={0.2}
          className="absolute top-6 left-6 bg-white text-black shadow-xl p-5 rounded-xl border border-gray-200 w-72 z-50 cursor-move"
        >

          <h3 className="text-xl font-semibold mb-2">Marker Clustering</h3>
          <p className="text-sm text-gray-600 mb-3 leading-tight">
            This panel uses external data points and filters them dynamically.
          </p>
          <div className="space-y-2">
            <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)} className="w-full p-2 border rounded-md text-sm bg-white">
              <option>All</option>
              <option>Red</option>
              <option>Blue</option>
              <option>Green</option>
              <option>Purple</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full p-2 border rounded-md text-sm bg-white">
              <option>All</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-2 border rounded-md text-sm bg-white">
              <option>All</option>
              <option>active</option>
              <option>inactive</option>
            </select>
          </div>
        </motion.div>
      )}

      <div className="absolute top-0 right-0 h-full flex flex-col justify-around pr-4 space-y-2 z-40">
        {Object.entries(bankImages).map(([clusterKey, src]) => (
          <img
            key={clusterKey}
            ref={(el) => {
              imageRefs.current[clusterKey] = el;
            }}
            src={src}
            alt={clusterKey}
            className="w-10 h-10 object-contain"
          />
        ))}
      </div>

      {Object.entries(clusterCenters).flatMap(([clusterName, center]) => {
        const color = {
          cluster0: "#dc2626",
          cluster1: "#059669",
          cluster2: "#1d4ed8",
          cluster3: "#7c3aed",
        }[clusterName];

        return Object.entries(imageRefs.current).map(([logoName, logoRef]) => {
          if (!logoRef || !containerRef.current) return null;

          const logoRect = logoRef.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();

          const startX = (center.leftPercent / 100) * containerRef.current.offsetWidth;
          const startY = (center.topPercent / 100) * containerRef.current.offsetHeight;
          const endX = logoRect.left + logoRect.width / 2 - containerRect.left;
          const endY = logoRect.top + logoRect.height / 2 - containerRect.top;

          const dx = endX - startX;
          const dy = endY - startY;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

          const thickness = 2 + Math.min(Math.max(center.propor, 0), 1) * 6;
          const animationDuration = 3 - Math.min(Math.max(center.propor, 0), 1) * 2;

          return (
            <div
              key={`${clusterName}-${logoName}`}
              className="absolute group"
              style={{
                top: `${center.topPercent}%`,
                left: `${center.leftPercent}%`,
                width: `${length}px`,
                height: `${thickness}px`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: "left center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `repeating-linear-gradient(to right, ${color}, ${color} 5px, transparent 5px, transparent 10px)`,
                  backgroundSize: "200% 100%",
                  animation: `dash ${animationDuration}s linear infinite`,
                }}
              />
              <div
                className="absolute opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-white text-black text-xs px-3 py-1 rounded shadow border"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -150%)",
                  whiteSpace: "nowrap",
                }}
              >
                {`Cluster: ${clusterName}`}
                <br />
                {`Banco: ${logoName}`}
                <br />
                {`Propor: ${(center.propor * 100).toFixed(1)}%`}
              </div>
            </div>
          );
        });
      })}

      <AnimatePresence>
        {filteredClusters.map((cluster) => {
          const baseColor = {
            red: "#dc2626",
            blue: "#1d4ed8",
            green: "#059669",
            purple: "#7c3aed",
            gray: "#6b7280",
          }[cluster.color];

          const ring1 = {
            red: "#f87171",
            blue: "#3b82f6",
            green: "#34d399",
            purple: "#c084fc",
            gray: "#d1d5db",
          }[cluster.color];

          const ring2 = {
            red: "#fca5a5",
            blue: "#93c5fd",
            green: "#6ee7b7",
            purple: "#d8b4fe",
            gray: "#e5e7eb",
          }[cluster.color];

          const ring3 = {
            red: "#fecaca",
            blue: "#dbeafe",
            green: "#bbf7d0",
            purple: "#ede9fe",
            gray: "#f3f4f6",
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
                top: `calc(${cluster.topPercent}% - 6px)`,
                left: `calc(${cluster.leftPercent}% - 6px)`,
                width: "12px",
                height: "12px",
              }}
            >
              <div className="absolute w-full h-full flex items-center justify-center z-0 pointer-events-none">
                {[ring3, ring2, ring1].map((ring, idx) => (
                  <motion.div
                    key={idx}
                    className="absolute rounded-full"
                    style={{
                      width: `${12 - idx * 4}px`,
                      height: `${12 - idx * 4}px`,
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

              <div
                className="relative z-10 rounded-full shadow-sm"
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: baseColor,
                  border: `1px solid ${ring2}`,
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <style>{`
        @keyframes dash {
          0% { background-position: 0 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
}
