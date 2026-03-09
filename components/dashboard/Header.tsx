"use client";

export default function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center border border-border shadow-sm">
            <img src="/favicon.ico" alt="ParallelAI" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h1 className="text-primary font-bold text-xl tracking-tight leading-none">
              ParallelAI
            </h1>
            <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider mt-1">
              AI Comparison Dashboard
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
        </div>
      </div>
    </header>
  );
}
