"use client";

import { Download, Image, Loader2 } from "lucide-react";
import { useState } from "react";
import html2canvas from "html2canvas-pro";

type Props = {
  targetId: string;
};

export default function ExportBar({ targetId }: Props) {
  const [exporting, setExporting] = useState(false);

  const exportPNG = async () => {
    setExporting(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `parallelai-comparison-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("PNG Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-white/20 text-xs mr-1">
        <Download className="w-3 h-3 inline mr-1" />
        Export:
      </span>
      <button
        onClick={exportPNG}
        disabled={exporting}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60 transition-all duration-200 disabled:opacity-40"
      >
        {exporting ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Image className="w-3 h-3" />
        )}
        PNG
      </button>
    </div>
  );
}
