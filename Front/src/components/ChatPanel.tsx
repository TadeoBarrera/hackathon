// src/components/ChatPanel.tsx
import { useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://127.0.0.1:3000";

export default function ChatPanel() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Bienvenido. ¿Qué te gustaría saber sobre tus datos?" },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const message = text.trim();
    if (!message || loading) return;

    // agrega mensaje del usuario
    setMsgs((m) => [...m, { role: "user", text: message }]);
    setText("");
    setLoading(true);

    try {
      // llama a la API /chat con el input del usuario
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `HTTP ${res.status}`);
      }

      const data: { reply: string; widgets: any[] } = await res.json();

      // muestra la respuesta de Gemini en el chat
      setMsgs((m) => [...m, { role: "assistant", text: data.reply || "Listo." }]);

      // notifica al HomePanel/Dashboard para actualizar widgets
      window.dispatchEvent(new CustomEvent("dashboard:update", { detail: data.widgets }));
    } catch (err: any) {
      setMsgs((m) => [
        ...m,
        { role: "assistant", text: `Error al generar datos: ${err?.message ?? "desconocido"}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="fixed right-0 top-0 h-screen w-[24vw] min-w-[280px] bg-[#0f172a] text-white border-l border-[#263140] flex flex-col shadow-xl z-50">
<header
  className="h-17 bg-[#111827] border-b border-[#263140]
             flex items-center justify-center
             text-3xl  text-white tracking-wide"
>
  GateGPT!
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

        {loading && (
          <div className="max-w-[85%]">
            <div className="rounded-xl px-3 py-2 text-sm bg-[#15243D] text-gray-300">
              Generando datos…
            </div>
          </div>
        )}
      </div>

      <form onSubmit={send} className="p-3 border-t border-[#263140] flex gap-2 bg-[#0f172a]">
        <input
          id="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={loading ? "Generando…" : "Escribe un mensaje…"}
          disabled={loading}
          className="flex-1 bg-[#0b1222] border border-[#263140] rounded-md px-3 py-2 text-sm outline-none focus:border-[#1D99D6] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="text-sm bg-[#1D99D6] hover:brightness-110 px-3 py-2 rounded-md disabled:opacity-60"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </form>
    </aside>
  );
}
