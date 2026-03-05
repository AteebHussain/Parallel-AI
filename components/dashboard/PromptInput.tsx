"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MODELS } from "@/lib/models";
import { Loader2, Send, RotateCcw } from "lucide-react";

type Props = {
  onCompare: (prompt: string, selectedModels: string[]) => void;
  isLoading: boolean;
  onReset: () => void;
};

export default function PromptInput({ onCompare, isLoading, onReset }: Props) {
  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(
    MODELS.map((m) => m.id),
  );

  const toggleModel = (id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    if (!prompt.trim() || selectedModels.length === 0 || isLoading) return;
    onCompare(prompt, selectedModels);
  };

  const handleReset = () => {
    setPrompt("");
    setSelectedModels(MODELS.map((m) => m.id));
    onReset();
  };

  return (
    <div className="bg-[#222831] border border-border/50 rounded-2xl p-6 space-y-4 shadow-sm">
      {/* Model Selector */}
      <div className="flex flex-wrap gap-2">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
              selectedModels.includes(model.id)
                ? `${model.bgColor} ${model.color} border-current shadow-sm`
                : "bg-transparent text-muted-foreground/40 border-border/50 hover:border-border hover:text-muted-foreground"
            }`}
          >
            {model.name}
            <span className="ml-1.5 text-[9px] opacity-50 uppercase">{model.provider}</span>
          </button>
        ))}
      </div>

      {/* Prompt Input */}
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask anything -- compare how each model responds..."
        className="bg-[#393E46] border-border text-foreground placeholder:text-muted-foreground/40 resize-none min-h-[140px] text-sm focus:ring-primary focus:border-primary focus-visible:ring-primary focus-visible:border-primary transition-all duration-300 rounded-xl shadow-inner outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
        }}
      />

      {/* Footer */}
      <div className="flex items-center justify-end">
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground/60 hover:text-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-wider"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !prompt.trim() || selectedModels.length === 0 || isLoading
            }
            className="bg-[#FFD369] hover:bg-[#f5c842] text-[#222831] text-[10px] font-bold uppercase tracking-widest px-8 transition-colors duration-200"          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-2" />
                Compare
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
