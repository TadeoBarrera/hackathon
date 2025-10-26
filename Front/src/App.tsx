import { useState, useEffect } from "react";
import HomePanel from "./components/HomePanel";
import ChatPanel from "./components/ChatPanel";
import logo from "./assets/logo.png";

export default function App() {
  const [section] = useState("home");
  const [showChat, setShowChat] = useState(false);

  // ✅ Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + B → abre o cierra
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setShowChat((prev) => !prev);
      }

      // Esc → cierra
      if (e.key === "Escape") {
        setShowChat(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ✅ Enfocar el campo de texto al abrir el chat
  useEffect(() => {
    if (showChat) {
      setTimeout(() => {
        const input = document.getElementById("chat-input") as HTMLInputElement | null;
        input?.focus();
      }, 150); // pequeño delay para asegurar que el chat ya esté renderizado
    }
  }, [showChat]);

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-r from-white via-[#bfc2c6] to-[#727e92] text-white relative">
      {/* HEADER */}
      <header
        className={`z-30 border-b border-[#2a394a]
            bg-gradient-to-r from-white via-[#bfc2c6] to-[#727e92]
            text-slate-900 h-17 sticky top-0 flex items-center
            px-4 sm:px-6 lg:px-8 transition-all duration-300
            ${showChat ? "mr-[24vw]" : ""}`}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="inline-flex items-center">
            <img
              src={logo}
              alt="gategroup"
              className="h-10 md:h-12 w-auto object-contain"
              draggable={false}
            />
          </a>
          <button
            onClick={() => setShowChat(!showChat)}
            className="bg-[#1a294a] hover:bg-[#08163a] active:bg-[#070f29]
                       text-white px-5 py-2.5 rounded-md text-sm font-semibold shadow-md
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]
                       focus-visible:ring-offset-2 focus-visible:ring-offset-white/70"
          >
            {showChat ? "Ocultar Chat" : "Mostrar Chat"}
          </button>
        </div>
      </header>

      {/* CONTENIDO */}
      <section
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
          showChat ? "mr-[24vw]" : ""
        }`}
      >
        {section === "home" && <HomePanel />}
      </section>

      {/* CHAT */}
      {showChat && <ChatPanel />}
    </main>
  );
}
