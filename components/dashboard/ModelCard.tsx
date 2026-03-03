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
      className={`rounded-2xl border p-5 flex flex-col gap-4 min-h-[300px] ${model.bgColor} bg-black/40 backdrop-blur-sm`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-semibold text-sm ${model.color}`}>
            {model.name}
          </h3>
          <p className="text-white/30 text-xs mt-0.5">{model.provider}</p>
        </div>
        <div className="flex gap-2">
          {response?.latency != null && response.latency > 0 && (
            <Badge
              variant="outline"
              className="text-white/40 border-white/10 text-xs gap-1"
            >
              <Clock className="w-3 h-3" />
              {(response.latency / 1000).toFixed(2)}s
            </Badge>
          )}
          {response?.tokens != null && response.tokens > 0 && (
            <Badge
              variant="outline"
              className="text-white/40 border-white/10 text-xs gap-1"
            >
              <Hash className="w-3 h-3" />
              {response.tokens} tokens
            </Badge>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating response...</span>
          </div>
        )}

        {!isLoading && !response && (
          <p className="text-white/20 text-sm italic">
            Response will appear here after you submit a prompt.
          </p>
        )}

        {!isLoading && response?.error && (
          <div className="flex items-start gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{response.error}</span>
          </div>
        )}

        {!isLoading && response?.text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <MarkdownRenderer content={response.text} />
          </motion.div>
        )}
      </div>

      {/* Copy Button */}
      {!isLoading && response?.text && (
        <div className="flex justify-end pt-2 border-t border-white/5">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              copied
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
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
