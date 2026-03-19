"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/dashboard/Header";
import PromptInput from "@/components/dashboard/PromptInput";
import ComparisonGrid from "@/components/dashboard/ComparisonGrid";
import ExportBar from "@/components/dashboard/ExportBar";
import PromptHistory from "@/components/dashboard/PromptHistory";
import { MODELS } from "@/lib/models";
import type { ResponseData, HistoryEntry } from "@/types";

const HISTORY_KEY = "parallelai-history";
const MAX_HISTORY_ENTRIES = 20;

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
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    }
  }, []);

  const handleCompare = async (prompt: string, models: string[]) => {
    setIsLoading(true);
    setSelectedModels(models);
    setResponses({});
    responsesRef.current = {};
    setStreamingModels(new Set(models));
    
    // Auto-scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

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
              setHistory((prev) => {
                const next = [entry, ...prev].slice(0, MAX_HISTORY_ENTRIES);
                localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
                return next;
              });
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

  const handleDeleteEntry = (id: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const hasResponses = Object.keys(responses).length > 0;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Prompt History Sidebar */}
      <PromptHistory
        history={history}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
        onSelect={handleHistorySelect}
        onClear={() => {
          setHistory([]);
          localStorage.removeItem(HISTORY_KEY);
        }}
        onDeleteEntry={handleDeleteEntry}
      />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* Hero Text */}
        <div className="text-center space-y-3 pb-6">
          <h2 className="text-[32px] font-bold tracking-tight text-[#EEEEEE]">
            Compare AI Models <span className="text-[#D72323]">Side by Side</span>
          </h2>

          <p className="text-muted-foreground text-sm font-medium max-w-lg mx-auto leading-relaxed">
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

        {/* Results Section */}
        {(isLoading || hasResponses) ? (
          <div ref={resultsRef} className="space-y-4">
            {!isLoading && hasResponses && (
              <div className="flex justify-end pb-2">
                <ExportBar targetId="comparison-results" />
              </div>
            )}
            
            <div id="comparison-results">
              <ComparisonGrid
                responses={responses}
                isLoading={isLoading && !hasResponses}
                selectedModels={selectedModels}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground/30 text-sm italic">
              Your model responses will appear here side by side.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}