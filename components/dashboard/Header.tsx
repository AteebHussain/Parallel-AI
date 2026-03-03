"use client";

import { Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">
              ParallelAI
            </h1>
            <p className="text-white/40 text-xs mt-0.5">
              Compare AI models side by side
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Live Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/40 text-xs">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
