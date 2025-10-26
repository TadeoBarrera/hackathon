import { useState } from "react";
import DashboardLogic from "./components/logic/DashboardLogic";
import ChatLogic from "./components/logic/ChatLogic";
import logo from "./assets/logo.png";

const DRAWER_W = 420;

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen w-full text-white">
      <header className={["flex items-center justify-between border-b border-white/10 bg-neutral-900 px-8 py-4", open ? `pr-[${DRAWER_W}px]` : "pr-8", "transition-all duration-300"].join(" ")}>
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-6 w-auto object-contain" />
          <span className="text-sm text-neutral-400">Demo IA • Queries dinámicas</span>
        </div>
        <button onClick={() => setOpen(s=>!s)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">
          {open ? "Cerrar chat" : "Abrir chat"}
        </button>
      </header>

      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#15243D] via-[#0E4385] to-[#111827]">
        <main className={["px-8 py-8 transition-all duration-300", open ? `pr-[${DRAWER_W}px]` : "pr-8"].join(" ")}>
          <DashboardLogic />
        </main>
      </div>

      {/* Drawer fuera del flujo */}
      <aside
        className="fixed top-0 right-0 z-50 h-screen border-l border-white/10 bg-neutral-900/95 backdrop-blur transition-transform duration-300"
        style={{ width: DRAWER_W, transform: open ? "translateX(0)" : `translateX(${DRAWER_W}px)` }}
      >
        <ChatLogic />
      </aside>
    </div>
  );
}
