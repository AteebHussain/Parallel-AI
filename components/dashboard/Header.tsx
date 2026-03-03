"use client";

export default function Header() {
  return (
    <header className="border-b border-[#465C88]/20 bg-black/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#465C88]/20 to-[#FF7A30]/10 flex items-center justify-center border border-[#465C88]/30 shadow-lg shadow-black/20">
            <img src="/favicon.ico" alt="ParallelAI" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h1 className="text-[#E9E3DF] font-bold text-xl tracking-tight leading-none">
              ParallelAI
            </h1>
            <p className="text-[#465C88] text-[10px] font-medium uppercase tracking-widest mt-1">
              AI Comparison Dashboard
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF7A30]/5 border border-[#FF7A30]/10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A30] animate-pulse shadow-[0_0_8px_rgba(255,122,48,0.5)]" />
            <span className="text-[#FF7A30] text-[10px] font-bold uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
