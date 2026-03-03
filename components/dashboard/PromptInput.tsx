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
    <div className="bg-black/40 border border-[#465C88]/20 backdrop-blur-md rounded-2xl p-6 space-y-4 shadow-2xl">
      {/* Model Selector */}
      <div className="flex flex-wrap gap-2">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
              selectedModels.includes(model.id)
                ? `${model.bgColor} ${model.color} border-current shadow-sm`
                : "bg-black/20 text-[#465C88] border-[#465C88]/20 hover:border-[#465C88]/40 hover:text-[#465C88]/80"
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
        placeholder="Input your query — Compare model performance..."
        className="bg-black/20 border-[#465C88]/20 text-[#E9E3DF] placeholder:text-[#465C88]/40 resize-none min-h-[140px] text-sm focus:ring-[#FF7A30] focus:border-[#FF7A30] transition-all duration-300 rounded-xl"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
        }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[#465C88]/60 text-[10px] font-medium uppercase tracking-widest">
          Ctrl + Enter to execute
        </span>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-[#465C88] hover:text-[#FF7A30] hover:bg-[#FF7A30]/5 text-[10px] font-bold uppercase tracking-wider"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !prompt.trim() || selectedModels.length === 0 || isLoading
            }
            className="bg-[#FF7A30] hover:bg-[#FF7A30]/90 text-black text-[10px] font-bold uppercase tracking-widest px-6 shadow-[0_0_15px_rgba(255,122,48,0.2)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-2" />
                Execute
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
