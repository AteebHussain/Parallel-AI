"use client";

import { useState } from "react";
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
  const [selectedModels, setSelectedModels] = useState<string[]>(
    MODELS.map((m) => m.id),
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleCompare = async (prompt: string, models: string[]) => {
    setIsLoading(true);
    setSelectedModels(models);
    setResponses({});

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, models }),
      });

      const data = await res.json();
      setResponses(data);

      // Save to history
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        prompt,
        responses: data,
        models,
        timestamp: new Date(),
      };
      setHistory((prev) => [entry, ...prev]);
    } catch (err) {
      console.error("Compare failed:", err);
    } finally {
      setIsLoading(false);
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
        {!isLoading && Object.keys(responses).length > 0 && (
          <ExportBar targetId="comparison-results" />
        )}

        {/* Results Grid */}
        {(isLoading || Object.keys(responses).length > 0) && (
          <div id="comparison-results">
            <ComparisonGrid
              responses={responses}
              isLoading={isLoading}
              selectedModels={selectedModels}
            />
          </div>
        )}
      </div>
    </main>
  );
}
