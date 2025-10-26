// src/lib/api.ts
import type { WidgetInput } from "../components/DashboardDynamic";

export type ChatApiResponse = {
  reply: string;
  widgets: WidgetInput[];
};

// Puedes configurar la URL desde .env.local => VITE_API_URL="http://127.0.0.1:3000"
const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://127.0.0.1:3000";

export async function askDashboard(message: string): Promise<ChatApiResponse> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Chat error ${res.status}: ${text || res.statusText}`);
  }

  return res.json();
}
