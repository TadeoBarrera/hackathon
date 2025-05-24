// App.tsx
import ClusterPanel from "./components/ClusterPanel";

export default function App() {
  return (
    <main className="min-h-screen bg-white flex">
      <aside className="w-[20vw] bg-gray-100 p-4 border-r">
        <nav className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-2">Basic Examples</h2>
            <ul className="space-y-1">
              <li className="text-blue-500 cursor-pointer">Basic Data</li>
              <li className="text-blue-500 cursor-pointer">Change Display</li>
              <li className="text-blue-500 cursor-pointer">Markers and Info</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">Advanced</h2>
            <ul className="space-y-1">
              <li className="text-blue-500 cursor-pointer">Cluster Panel</li>
              <li className="text-blue-500 cursor-pointer">Custom Clustering</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">Visualization</h2>
            <ul className="space-y-1">
              <li className="text-blue-500 cursor-pointer">Geometry</li>
              <li className="text-blue-500 cursor-pointer">Heatmap</li>
              <li className="text-blue-500 cursor-pointer">Drawing</li>
            </ul>
          </section>
        </nav>
      </aside>
      <section className="flex-1 relative">
        <ClusterPanel />
      </section>
    </main>
  );
}
