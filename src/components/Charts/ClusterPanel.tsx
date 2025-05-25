/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const imageRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsed: ClusterPoint[] = [];
    const allX: number[] = [], allY: number[] = [];
    const PADDING = 0.15;

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
      <div className="absolute top-0 right-0 h-full flex flex-col justify-around pr-4 space-y-2 z-40">
        {Object.entries(bankImages).map(([clusterKey, src]) => (
          <img
            key={clusterKey}
            ref={(el) => {
              imageRefs.current[clusterKey] = el;
            }}
            src={src}
            alt={clusterKey}
            className="w-20 h-20 object-contain"
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
                  top: "-40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  transformOrigin: "center center",
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
        {clusters.map((cluster) => (
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
              {["#f3f4f6", "#e5e7eb", "#d1d5db"].map((ring, idx) => (
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
                backgroundColor: cluster.color,
                border: `1px solid #e5e7eb`,
              }}
            />
          </motion.div>
        ))}
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