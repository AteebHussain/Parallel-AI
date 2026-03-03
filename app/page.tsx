"use client";

import { useState, useRef } from "react";
import Header from "@/components/dashboard/Header";
import PromptInput from "@/components/dashboard/PromptInput";
import ComparisonGrid from "@/components/dashboard/ComparisonGrid";
import ExportBar from "@/components/dashboard/ExportBar";
import PromptHistory, {
  HistoryEntry,
} from "@/components/dashboard/PromptHistory";
import { MODELS } from "@/lib/models";

type ResponseData = {
  text?: string;
  error?: string;
  latency?: number;
  tokens?: number;
};

export default function Home() {
  const [responses, setResponses] = useState<Record<string, ResponseData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [streamingModels, setStreamingModels] = useState<Set<string>>(
    new Set(),
  );
  const [selectedModels, setSelectedModels] = useState<string[]>(
    MODELS.map((m) => m.id),
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const responsesRef = useRef<Record<string, ResponseData>>({});

  const handleCompare = async (prompt: string, models: string[]) => {
    setIsLoading(true);
    setSelectedModels(models);
    setResponses({});
    responsesRef.current = {};
    setStreamingModels(new Set(models));

    const startTimes: Record<string, number> = {};
    models.forEach((m) => (startTimes[m] = Date.now()));

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, models }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(trimmed.slice(6));

            if (data.type === "chunk" && data.modelId) {
              const prev = responsesRef.current[data.modelId]?.text || "";
              const updated = {
                ...responsesRef.current,
                [data.modelId]: {
                  text: prev + data.text,
                  latency: Date.now() - startTimes[data.modelId],
                  tokens:
                    data.tokens ?? responsesRef.current[data.modelId]?.tokens ?? 0,
                },
              };
              responsesRef.current = updated;
              setResponses({ ...updated });
            } else if (data.type === "done" && data.modelId) {
              if (data.tokens) {
                const updated = {
                  ...responsesRef.current,
                  [data.modelId]: {
                    ...responsesRef.current[data.modelId],
                    tokens: data.tokens,
                    latency: Date.now() - startTimes[data.modelId],
                  },
                };
                responsesRef.current = updated;
                setResponses({ ...updated });
              }
              setStreamingModels((prev) => {
                const next = new Set(prev);
                next.delete(data.modelId);
                return next;
              });
            } else if (data.type === "error" && data.modelId) {
              const updated = {
                ...responsesRef.current,
                [data.modelId]: { error: data.error, latency: 0 },
              };
              responsesRef.current = updated;
              setResponses({ ...updated });
              setStreamingModels((prev) => {
                const next = new Set(prev);
                next.delete(data.modelId);
                return next;
              });
            } else if (data.type === "complete") {
              const entry: HistoryEntry = {
                id: Date.now().toString(),
                prompt,
                responses: { ...responsesRef.current },
                models,
                timestamp: new Date(),
              };
              setHistory((prev) => [entry, ...prev]);
            }
          } catch {
            // Skip malformed SSE data
          }
        }
      }
    } catch (err) {
      console.error("Compare failed:", err);
    } finally {
      setIsLoading(false);
      setStreamingModels(new Set());
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setResponses(entry.responses);
    setSelectedModels(entry.models);
    setHistoryOpen(false);
  };

  const handleReset = () => {
    setResponses({});
    setSelectedModels(MODELS.map((m) => m.id));
  };

  const hasResponses = Object.keys(responses).length > 0;

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <Header />

      {/* Prompt History Sidebar */}
      <PromptHistory
        history={history}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
        onSelect={handleHistorySelect}
        onClear={() => setHistory([])}
      />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* Hero Text */}
        <div className="text-center space-y-2 pb-4">
          <h2 className="text-3xl font-bold text-white">
            Compare AI Models{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              Side by Side
            </span>
          </h2>
          <p className="text-white/40 text-sm max-w-lg mx-auto">
            Enter a prompt below and see how Gemma, Nemotron, Step, and
            Trinity respond — with latency and token usage tracked in real time.
          </p>
        </div>

        {/* Prompt Input */}
        <PromptInput
          onCompare={handleCompare}
          isLoading={isLoading}
          onReset={handleReset}
        />

        {/* Export Bar */}
        {!isLoading && hasResponses && (
          <ExportBar targetId="comparison-results" />
        )}

        {/* Results Grid */}
        {(isLoading || hasResponses) && (
          <div id="comparison-results">
            <ComparisonGrid
              responses={responses}
              isLoading={isLoading && !hasResponses}
              selectedModels={selectedModels}
            />
          </div>
        )}
      </div>
    </main>
  );
}