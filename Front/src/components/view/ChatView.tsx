import { useState } from "react";

export type ChatMsg = { role: "user" | "agent"; text: string; id?: string };

export default function ChatView({
  messages,
  onSend,
  placeholder = "Pide datos o una gráfica…",
}: {
  messages: ChatMsg[];
  onSend: (text: string) => void;
  placeholder?: string;
}) {
  const [msg, setMsg] = useState("");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b border-white/10 px-4 py-3 text-sm font-semibold">Chat</header>

      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-3 text-xs">
        {messages.map((m) => (
          <div
            key={m.id ?? Math.random().toString(36).slice(2)}
            className={[
              "max-w-[85%] rounded-2xl px-3 py-2",
              m.role === "user"
                ? "bg-white/5 text-white/90"
                : "self-end border border-cyan-500/20 bg-cyan-500/10 text-[#cfeaff]",
            ].join(" ")}
          >
            {m.text}
          </div>
        ))}
      </div>

      <form
        className="border-t border-white/10 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          const t = msg.trim();
          if (!t) return;
          onSend(t);
          setMsg("");
        }}
      >
        <div className="flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 text-sm outline-none placeholder:text-neutral-500"
            placeholder={placeholder}
          />
          <button className="rounded-xl bg-cyan-600 px-3 py-2 text-sm font-medium hover:opacity-90">
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
