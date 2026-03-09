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
        backgroundColor: "#000000",
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
    <div className="flex items-center justify-end gap-2 pr-2">
      <button
        onClick={exportPNG}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-secondary/40 text-muted-foreground border border-border hover:bg-secondary/60 hover:text-foreground hover:border-border transition-all duration-300 disabled:opacity-40 shadow-sm"
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
