import React from "react";
import { Link } from "react-router-dom";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] bg-brand-dark flex items-center justify-center py-16 px-4 overflow-hidden text-white">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center p-8 sm:p-10 rounded-3xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card">
        {/* Animated Icon Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-forest-900/80 border border-emerald-500/30 text-emerald-400 mb-6 shadow-inner">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        {/* 404 Gradient Title */}
        <p className="font-display font-black text-7xl sm:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-mint-300 to-lime-300 mb-2">
          404
        </p>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mb-3">
          Page Not Found
        </h1>

        <p className="text-sage-100/80 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
          The page or market listing you are looking for doesn't exist, has been removed, or moved to a new route.
        </p>

        {/* Action Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-mint-400 text-brand-dark font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-emerald-500/20"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}