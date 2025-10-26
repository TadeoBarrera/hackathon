import { useState } from "react";
import HomePanel from "./components/HomePanel";
import ChatPanel from "./components/ChatPanel";

export default function App() {
  const [section] = useState("home");
  const [showChat, setShowChat] = useState(false);

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-[#1F2937] via-[#2D3748] to-[#111827] text-white relative">
      {/* Contenido principal */}
      <section
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
          showChat ? "mr-[24vw]" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <button
            onClick={() => setShowChat(!showChat)}
            className="bg-[#1D99D6] hover:bg-[#0E73A6] text-white px-4 py-2 rounded-md text-sm shadow-md"
          >
            {showChat ? "Ocultar Chat" : "Mostrar Chat"}
          </button>
        </div>

        {section === "home" && <HomePanel />}
      </section>

      {/* Chat a la derecha (visible solo si está activado) */}
      {showChat && <ChatPanel />}
    </main>
  );
}
