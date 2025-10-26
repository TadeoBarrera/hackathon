import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatView, { type ChatMsg } from "../view/ChatView";

/** Hook y contenedor lógico del chat.
 *  Hoy: mensajes dummy + envío local.
 *  Preparado para: WebSocket/EventSource/HTTP streaming. */
export function useChatLogic() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "user",  text: "¿Cuántas galletas para el vuelo AM123 mañana?" },
    { role: "agent", text: "Preparando consulta y panel…" },
  ]);

  // --- backend wiring (placeholder) ---
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    // TODO: reemplazar url por la real
    // wsRef.current = new WebSocket("wss://tu-backend/ws");
    // wsRef.current.onmessage = (ev) => {
    //   const data = JSON.parse(ev.data);
    //   setMessages((m) => [...m, { role: "agent", text: data.text }]);
    // };
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  useEffect(() => {
    // connect(); // activa cuando exista backend
    return () => disconnect();
  }, [connect, disconnect]);

  const send = useCallback((text: string) => {
    setMessages((m) => [...m, { role: "user", text }]);
    // wsRef.current?.send(JSON.stringify({ type: "user_message", text }));
    // Fallback demo: respuesta simulada
    setTimeout(() => {
      setMessages((m) => [...m, { role: "agent", text: "OK. Consultando y generando dashboard…" }]);
    }, 300);
  }, []);

  return useMemo(() => ({ messages, send, connect, disconnect }), [messages, send, connect, disconnect]);
}

/** Contenedor lógico listo para usar en App (drawer, modal, etc.) */
export default function ChatLogic() {
  const chat = useChatLogic();
  return <ChatView messages={chat.messages} onSend={chat.send} />;
}
