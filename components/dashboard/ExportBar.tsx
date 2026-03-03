"use client";

import { Download, Image, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import html2canvas from "html2canvas-pro";

type Props = {
  targetId: string;
};

export default function ExportBar({ targetId }: Props) {
  const [exporting, setExporting] = useState<"png" | "pdf" | null>(null);

  const captureElement = async () => {
    const element = document.getElementById(targetId);
    if (!element) return null;

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false,
    });

    return canvas;
  };

  const exportPNG = async () => {
    setExporting("png");
    try {
      const canvas = await captureElement();
      if (!canvas) return;

      const link = document.createElement("a");
      link.download = `parallelai-comparison-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("PNG Export failed:", err);
    } finally {
      setExporting(null);
    }
  };

  const exportPDF = async () => {
    setExporting("pdf");
    try {
      const canvas = await captureElement();
      if (!canvas) return;

      // Create a PDF using the canvas dimensions
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // A4 dimensions in points (72 dpi)
      const pdfWidth = 595.28;
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      // Build a simple printable page and trigger print dialog
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>ParallelAI Comparison</title>
            <style>
              * { margin: 0; padding: 0; }
              body { background: #0a0a0f; display: flex; justify-content: center; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { background: white; }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" style="width: ${pdfWidth}px;" />
            <script>
              window.onload = function() {
                setTimeout(function() { window.print(); window.close(); }, 300);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error("PDF Export failed:", err);
    } finally {
      setExporting(null);
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
        disabled={!!exporting}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60 transition-all duration-200 disabled:opacity-40"
      >
        {exporting === "png" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Image className="w-3 h-3" />
        )}
        PNG
      </button>
      <button
        onClick={exportPDF}
        disabled={!!exporting}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60 transition-all duration-200 disabled:opacity-40"
      >
        {exporting === "pdf" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <FileText className="w-3 h-3" />
        )}
        PDF
      </button>
    </div>
  );
}
