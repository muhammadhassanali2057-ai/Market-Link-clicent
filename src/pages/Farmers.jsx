import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Search, Store } from "lucide-react";
import api from "../api/axios.js";
import StarRating from "../components/StarRating.jsx";
import { SkeletonGrid, EmptyState, ErrorState } from "../components/StateViews.jsx";

export default function Farmers() {
  const [farmers, setFarmers] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  function load() {
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    api
      .get(`/farmers?${params.toString()}`)
      .then((res) => setFarmers(res.data.farmers))
      .catch(() => setError("Could not load farmers."));
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Meet the Farmers
          </h1>
          <p className="text-xs sm:text-sm text-sage-300 mt-1">
            Browse local growers selling at markets near you.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-96 mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-300/70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farmers by stall name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-900/60 border border-white/10 text-white placeholder-sage-300/50 text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-3d-card"
          />
        </div>

        {/* Dynamic States */}
        {error && <ErrorState message={error} onRetry={load} />}

        {!error && farmers === null && <SkeletonGrid count={6} />}

        {!error && farmers && farmers.length === 0 && (
          <EmptyState
            title="No farmers found"
            message="Try a different search term or clear filters."
            icon={Users}
          />
        )}

        {!error && farmers && farmers.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmers.map((f) => (
              <Link
                key={f._id}
                to={`/farmers/${f._id}`}
                className="group relative flex flex-col p-6 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card hover:border-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-base text-white truncate group-hover:text-emerald-400 transition-colors">
                      {f.stallName}
                    </h3>
                    <p className="text-xs text-sage-300/70 truncate mt-0.5">
                      {f.markets?.map((m) => m.name).join(", ") || "Market TBD"}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                  <StarRating
                    value={f.ratingAverage}
                    count={f.ratingCount}
                    size="w-3.5 h-3.5"
                  />
                  <span className="text-[11px] font-medium text-emerald-400 group-hover:translate-x-1 transition-transform duration-300">
                    View Stall &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}