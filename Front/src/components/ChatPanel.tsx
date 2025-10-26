// src/components/ChatPanel.tsx
import { useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatPanel() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Bienvenido. Escribe para dejar notas del hackatón." },
  ]);
  const [text, setText] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const u: Msg = { role: "user", text };
    const a: Msg = { role: "assistant", text: "Anotado." };
    setMsgs((m) => [...m, u, a]);
    setText("");
  }

  return (
    <aside className="fixed right-0 top-0 h-screen w-[24vw] min-w-[280px] bg-[#0f172a] text-white border-l border-[#263140] flex flex-col shadow-xl z-50">
      <header className="p-3 text-sm font-semibold bg-[#111827] border-b border-[#263140]">
        Chat
      </header>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : ""}`}>
            <div
              className={`rounded-xl px-3 py-2 text-sm ${
                m.role === "user" ? "bg-[#1D99D6] text-white" : "bg-[#15243D] text-gray-100"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="p-3 border-t border-[#263140] flex gap-2 bg-[#0f172a]">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje…"
          className="flex-1 bg-[#0b1222] border border-[#263140] rounded-md px-3 py-2 text-sm outline-none focus:border-[#1D99D6]"
        />
        <button
          type="submit"
          className="text-sm bg-[#1D99D6] hover:brightness-110 px-3 py-2 rounded-md"
        >
          Enviar
        </button>
      </form>
    </aside>
  );
}
