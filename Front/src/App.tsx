import { useState } from "react";
import HomePanel from "./components/HomePanel";
import ChatPanel from "./components/ChatPanel";

export default function App() {
  const [section] = useState("home");

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-[#1F2937] via-[#2D3748] to-[#111827] text-white">
      {/* Contenido principal */}
      <section className="flex-1 p-6 overflow-y-auto">
        {section === "home" && <HomePanel />}
      </section>

      {/* Chat a la derecha */}
      <ChatPanel />
    </main>
  );
}
