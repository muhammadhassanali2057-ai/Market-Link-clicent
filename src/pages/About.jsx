import React from "react";
import { Leaf, Users, Target, Info } from "lucide-react";

export default function About() {
  return (
    <div className="relative min-h-screen bg-brand-dark py-16 text-white overflow-hidden">
      {/* Background Lighting / Blur Effects */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-3d-card">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            About MarketLink
          </h1>
          <p className="text-sm sm:text-base text-sage-300 max-w-2xl mx-auto leading-relaxed">
            MarketLink (eGreen Basket) connects local farmers-market growers with customers, so shoppers always know
            what's in stock, when it's available, and where to pick it up — and farmers can plan their harvest with
            confidence.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="p-8 rounded-3xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card hover:border-emerald-500/30 transition duration-300">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">Our Mission</h3>
            <p className="text-xs sm:text-sm text-sage-300 leading-relaxed">
              Reduce wasted trips to the market, help farmers build lasting relationships with regular customers, and
              keep local food systems thriving.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card hover:border-emerald-500/30 transition duration-300">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">Built For This Project</h3>
            <p className="text-xs sm:text-sm text-sage-300 leading-relaxed">
              MarketLink was built as an end-to-end web solutions project for the TechWiz7 (Aptech) competition,
              following the official MarketLink SRS (eGreen Basket theme).
            </p>
          </div>
        </div>

        {/* Scope Note Card */}
        <div className="p-6 rounded-2xl bg-forest-900/40 backdrop-blur-md border border-white/10 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-mint-300/10 border border-mint-300/20 text-mint-300 shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-sage-300 leading-relaxed">
            <p className="font-bold text-white mb-1">A note on scope</p>
            <p>
              Per the project's constraints, MarketLink does not process online payments (payment happens in person at
              pickup) and does not offer delivery/courier logistics — the platform focuses entirely on discovery,
              pre-ordering, and pickup coordination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}