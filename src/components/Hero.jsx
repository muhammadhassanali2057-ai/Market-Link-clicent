import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf, ChevronDown, ShoppingBag, MapPin, ArrowRight } from "lucide-react";
import { HERO_IMAGE, HERO_VIDEO_SRC } from "../utils/imageAssets.js";

/**
 * Fullscreen Cinematic Background Video Hero Section
 * Matches the requested style: full-width background video with a clean dark readability overlay.
 */
export default function Hero() {
  const [videoFailed, setVideoFailed] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const showVideo = !videoFailed && !prefersReducedMotion;

  return (
    <section className="relative h-[92vh] min-h-[650px] w-full flex items-center justify-start overflow-hidden bg-brand-dark">
      
      {/* Fullscreen Background Media */}
      <div className="absolute inset-0 z-0">
        {showVideo ? (
          <video
            className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_IMAGE}
            onError={() => setVideoFailed(true)}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        ) : (
          <img
            src={HERO_IMAGE}
            alt="Fresh produce at a local farmers market"
            className={`w-full h-full object-cover object-center ${
              prefersReducedMotion ? "" : "animate-kenburns"
            }`}
            loading="eager"
          />
        )}

        {/* Professional Dark Overlay (Like the reference image) to make text readable over video */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/70 to-brand-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/60" />
      </div>

      {/* Content Container positioned cleanly on the left over the background video */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl py-12"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-300 bg-forest-900/80 border border-emerald-500/30 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 shadow-glow-emerald">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" /> LOCAL FARMERS • FRESH PRODUCE
          </span>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[1.1] text-white tracking-tight drop-shadow-md">
            Fresh From Local Farmers,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-mint-300 to-lime-300">
              Straight To Your Pickup.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sage-100/90 text-base sm:text-lg max-w-xl leading-relaxed drop-shadow">
            Discover nearby markets, browse what's actually in stock this week, and reserve a pickup slot with the
            farmer who grew it — no delivery fees, no middlemen.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              to="/markets"
              className="px-6 py-3.5 rounded-xl bg-gradient-btn text-white font-bold text-sm sm:text-base shadow-3d-card hover:shadow-3d-card-hover hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
            >
              <MapPin className="w-4 h-4 text-mint-100" />
              <span>Explore Markets</span>
            </Link>

            <Link
              to="/products"
              className="px-6 py-3.5 rounded-xl bg-forest-900/60 border border-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md hover:bg-forest-800/80 hover:border-emerald-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Shop Produce</span>
            </Link>

            <Link
              to="/register"
              className="px-4 py-3.5 rounded-xl text-emerald-300 font-semibold text-sm sm:text-base hover:text-white transition flex items-center gap-1 group"
            >
              <span>Become a Farmer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Down Arrow Indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-emerald-400/70 animate-bounce pointer-events-none z-10"
      >
        <ChevronDown className="w-7 h-7" />
      </div>
    </section>
  );
}