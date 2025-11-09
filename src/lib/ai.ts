export type ChatMessage = { role: "user" | "model" | "system"; content: string };

export async function* streamChat(
  body: { messages: ChatMessage[]; model?: string; temperature?: number },
  controller?: AbortController
) {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const res = await fetch(`${base}/api/chat/stream`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    signal: controller?.signal
  });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";
    for (const part of parts) {
      if (!part.startsWith("data:")) continue;
      const json = JSON.parse(part.slice(5));
      yield json as { delta?: string; done?: boolean; text?: string; error?: string };
    }
  }
}

export function getQuickSuggestions(): string[] {
  return [
    "Best hybrids under $400/mo",
    "Compare Camry vs. Corolla",
    "Explain lease vs finance",
    "Family-friendly SUVs"
  ];
}
