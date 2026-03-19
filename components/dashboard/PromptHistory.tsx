"use client";

import { useEffect, useRef } from "react";
import { Clock, MessageSquare, ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { HistoryEntry } from "@/types";

type Props = {
  history: HistoryEntry[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
  onDeleteEntry: (id: string) => void;
};

export default function PromptHistory({
  history,
  isOpen,
  onToggle,
  onSelect,
  onClear,
  onDeleteEntry,
}: Props) {
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button[title="View history"]') &&
        !(event.target as Element).closest('button[title="Close history"]')
      ) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <>
      {/* Toggle Button — always visible */}
      <button
        onClick={onToggle}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-secondary/10 border border-border border-l-0 rounded-r-[8px] w-[34px] h-[34px] flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 backdrop-blur-md shadow-sm"
        title={isOpen ? "Close history" : "View history"}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <Clock className="w-4 h-4" />
        )}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            ref={sidebarRef}
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-background/95 backdrop-blur-2xl border-r border-border z-40 flex flex-col shadow-sm pt-24"
          >
            {/* Context Label */}
            <div className="px-6 pt-2 -mb-2">
              <span className="text-[11px] font-bold tracking-[0.1em] text-[#555] uppercase">
                History
              </span>
            </div>

            {/* Header */}
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h2 className="text-foreground font-bold text-sm tracking-wide">
                  Recent Prompts
                </h2>
                <span className="text-muted-foreground text-[10px] font-bold">
                  [{history.length}]
                </span>
              </div>
              {history.length > 0 && (
                <button
                  onClick={onClear}
                  className="text-muted-foreground hover:text-primary transition-all p-1.5 rounded-[6px] hover:bg-primary/5"
                  title="Clear history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground/40 text-xs italic">
                  <MessageSquare className="w-8 h-8 mx-auto mb-4 opacity-20" />
                  <p>Your timeline is empty.</p>
                </div>
              ) : (
                history.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <button
                      onClick={() => onSelect(entry)}
                      className="w-full text-left p-4 rounded-[8px] bg-secondary/5 border border-border/50 hover:bg-secondary/10 hover:border-border transition-all duration-300 shadow-sm"
                    >
                      <p className="text-foreground/80 text-[13px] font-medium line-clamp-2 group-hover:text-foreground transition-colors leading-relaxed pr-6">
                         {entry.prompt}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                          <Clock className="w-2.5 h-2.5" />
                          {formatTime(entry.timestamp)}
                        </span>
                        <span className="text-muted-foreground/40 text-[9px] font-bold uppercase tracking-tighter">
                          {entry.models.length} Models
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEntry(entry.id);
                      }}
                      className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-[8px] text-muted-foreground/30 hover:text-white hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title="Delete entry"
                    >
                      <X className="w-[18px] h-[18px]" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-background/60 z-30 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
}

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}
