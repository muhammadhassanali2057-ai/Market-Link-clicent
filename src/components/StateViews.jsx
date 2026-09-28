import React from "react";
import { AlertTriangle, Inbox, RefreshCcw } from "lucide-react";

/**
 * Shared loading / empty / error state components styled for Dark Glassmorphism.
 */
export function SkeletonGrid({ count = 6, className = "" }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border border-emerald-500/10 bg-forest-900/40 backdrop-blur-xl shadow-3d-card"
        >
          <div className="h-48 w-full bg-white/5 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
          <div className="p-4 space-y-3">
            <div className="h-5 w-3/4 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-4 w-1/2 bg-white/5 rounded-lg animate-pulse" />
            <div className="pt-2 flex items-center justify-between">
              <div className="h-5 w-1/4 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-5 w-1/3 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", message = "", icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 rounded-3xl border border-white/5 bg-forest-900/20 backdrop-blur-xl my-6">
      <div className="w-14 h-14 rounded-2xl bg-forest-900/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-glow-emerald">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display font-bold text-lg text-white">{title}</h3>
      {message && <p className="text-xs text-sage-300/70 mt-1.5 max-w-sm leading-relaxed">{message}</p>}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong. Please try again.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 rounded-3xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-xl my-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-lg">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <p className="text-sm font-medium text-rose-200/90 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card hover:scale-105 active:scale-95 transition-all"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}