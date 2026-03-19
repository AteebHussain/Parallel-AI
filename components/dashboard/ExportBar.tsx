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
        backgroundColor: "#0D0D0D",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      link.download = `parallelai-${date}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("PNG Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex items-center justify-end">
      <button
        onClick={exportPNG}
        disabled={exporting}
        className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wider bg-background/50 text-muted-foreground border border-[#333] hover:bg-foreground/5 hover:text-foreground hover:border-foreground/20 transition-all duration-300 disabled:opacity-40 backdrop-blur-sm shadow-sm"
      >
        {exporting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Image className="w-3.5 h-3.5 text-primary" />
        )}
        Download PNG
      </button>
    </div>
  );
}
