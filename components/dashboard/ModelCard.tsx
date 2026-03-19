"use client";

import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Clock, Hash, Copy, Check } from "lucide-react";
import { Model } from "@/lib/models";
import { motion } from "framer-motion";
import { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import type { ResponseData } from "@/types";

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
      className={`rounded-[8px] border p-5 flex flex-col gap-4 ${
        response?.error ? "min-h-0" : "min-h-[340px]"
      } ${model.bgColor} backdrop-blur-md shadow-sm transition-colors duration-500`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-bold text-sm tracking-wide ${model.color}`}>
            {model.name}
          </h3>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mt-0.5">{model.provider}</p>
        </div>
        <div className="flex gap-2">
          {response?.latency != null && response.latency > 0 && (
            <Badge
              variant="outline"
              className={`text-[10px] gap-1 font-bold ${
                response.latency < 5000
                  ? "text-green-500 border-green-500/30 bg-green-500/5"
                  : response.latency < 15000
                  ? "text-yellow-500 border-yellow-500/30 bg-yellow-500/5"
                  : "text-red-500 border-red-500/30 bg-red-500/5"
              }`}
            >
              <Clock className="w-2.5 h-2.5" />
              {(response.latency / 1000).toFixed(2)}s
            </Badge>
          )}
          {response?.tokens != null && response.tokens > 0 && (
            <Badge
              variant="outline"
              className="text-foreground/60 border-border bg-muted/20 text-[10px] gap-1 rounded-[4px]"
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
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-bold uppercase tracking-wider animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Streaming {model.name}...</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-foreground/5 rounded-[4px] animate-pulse" />
              <div className="h-3 w-[90%] bg-foreground/5 rounded-[4px] animate-pulse" />
              <div className="h-3 w-[75%] bg-foreground/5 rounded-[4px] animate-pulse" />
            </div>
          </div>
        )}

        {!isLoading && !response && (
          <p className="text-muted-foreground/40 text-xs italic">
            Awaiting response...
          </p>
        )}

        {!isLoading && response?.error && (
          <div className="flex items-start gap-2 text-destructive text-xs">
            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
            <span>{response.error}</span>
          </div>
        )}

        {!isLoading && response?.text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-foreground/90 text-sm leading-relaxed"
          >
            <MarkdownRenderer content={response.text} />
          </motion.div>
        )}
      </div>

      {/* Copy Button */}
      {!isLoading && response?.text && (
        <div className="flex justify-end pt-3 border-t border-border/50">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${
              copied
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-background/20 text-muted-foreground border-[#333] hover:bg-foreground/5 hover:text-foreground hover:border-foreground/20"
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