import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, models } = await req.json();

  if (!prompt || !models || models.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
        );
      };

      await Promise.allSettled(
        models.map(async (modelId: string) => {
          try {
            const tokens = await streamOpenRouter(modelId, prompt, (chunk) => {
              send({ modelId, type: "chunk", text: chunk });
            });
            send({ modelId, type: "done", tokens });
          } catch (err) {
            send({
              modelId,
              type: "error",
              error: err instanceof Error ? err.message : "Unknown error",
            });
          }
        }),
      );

      send({ type: "complete" });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function streamOpenRouter(
  modelId: string,
  prompt: string,
  onChunk: (text: string) => void,
): Promise<number> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in .env.local");
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://parallelai.vercel.app",
      "X-Title": "ParallelAI",
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      stream: true,
      stream_options: { include_usage: true },
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      data?.error?.message || `OpenRouter error (${res.status})`,
    );
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";
  let totalTokens = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") break;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onChunk(content);

        // Capture token usage from the final chunk
        if (parsed.usage?.total_tokens) {
          totalTokens = parsed.usage.total_tokens;
        }
      } catch {
        // Skip malformed chunks
      }
    }
  }

  return totalTokens;
}
