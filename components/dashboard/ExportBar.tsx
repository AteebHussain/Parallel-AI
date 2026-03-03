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
    <div className="flex items-center justify-end gap-2 pr-2">
      <span className="text-[#465C88] text-[10px] font-bold uppercase tracking-widest mr-2">
        <Download className="w-3 h-3 inline mr-1.5" />
        Snapshot
      </span>
      <button
        onClick={exportPNG}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-black/40 text-[#465C88] border border-[#465C88]/20 hover:bg-[#465C88]/10 hover:text-[#E9E3DF] hover:border-[#465C88]/40 transition-all duration-300 disabled:opacity-40 shadow-sm"
      >
        {exporting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Image className="w-3.5 h-3.5 text-[#FF7A30]" />
        )}
        Download PNG
      </button>
    </div>
  );
}
