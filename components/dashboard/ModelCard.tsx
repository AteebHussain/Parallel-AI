"use client";

import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Clock, Hash, Copy, Check } from "lucide-react";
import { Model } from "@/lib/models";
import { motion } from "framer-motion";
import { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

type ResponseData = {
  text?: string;
  error?: string;
  latency?: number;
  tokens?: number;
};

type Props = {
  model: Model;
  response: ResponseData | null;
  isLoading: boolean;
};

export default function ModelCard({ model, response, isLoading }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!response?.text) return;
    try {
      await navigator.clipboard.writeText(response.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = response.text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border p-5 flex flex-col gap-4 min-h-[300px] ${model.bgColor} bg-black/60 backdrop-blur-md shadow-xl`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-bold text-sm tracking-wide ${model.color}`}>
            {model.name}
          </h3>
          <p className="text-[#465C88] text-[10px] font-semibold uppercase tracking-wider mt-0.5">{model.provider}</p>
        </div>
        <div className="flex gap-2">
          {response?.latency != null && response.latency > 0 && (
            <Badge
              variant="outline"
              className="text-[#E9E3DF]/60 border-[#465C88]/20 bg-[#465C88]/5 text-[10px] gap-1"
            >
              <Clock className="w-2.5 h-2.5" />
              {(response.latency / 1000).toFixed(2)}s
            </Badge>
          )}
          {response?.tokens != null && response.tokens > 0 && (
            <Badge
              variant="outline"
              className="text-[#E9E3DF]/60 border-[#465C88]/20 bg-[#465C88]/5 text-[10px] gap-1"
            >
              <Hash className="w-2.5 h-2.5" />
              {response.tokens}
            </Badge>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 relative overflow-auto custom-scrollbar">
        {isLoading && (
          <div className="flex items-center gap-2 text-[#465C88] text-xs font-medium">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Processing...</span>
          </div>
        )}

        {!isLoading && !response && (
          <p className="text-[#465C88]/40 text-xs italic">
            Awaiting response...
          </p>
        )}

        {!isLoading && response?.error && (
          <div className="flex items-start gap-2 text-[#FF7A30] text-xs">
            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
            <span>{response.error}</span>
          </div>
        )}

        {!isLoading && response?.text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[#E9E3DF]/90 text-sm leading-relaxed"
          >
            <MarkdownRenderer content={response.text} />
          </motion.div>
        )}
      </div>

      {/* Copy Button */}
      {!isLoading && response?.text && (
        <div className="flex justify-end pt-3 border-t border-[#465C88]/10">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
              copied
                ? "bg-[#FF7A30]/20 text-[#FF7A30] border border-[#FF7A30]/30 shadow-[0_0_10px_rgba(255,122,48,0.2)]"
                : "bg-[#465C88]/10 text-[#465C88] border border-[#465C88]/20 hover:bg-[#465C88]/20 hover:text-[#E9E3DF] hover:border-[#465C88]/40 shadow-sm"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}