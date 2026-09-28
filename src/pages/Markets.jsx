import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Search, Filter, X } from "lucide-react";
import api from "../api/axios.js";
import MapView from "../components/MapView.jsx";
import { SkeletonGrid, EmptyState, ErrorState } from "../components/StateViews.jsx";
import { MARKET_STALL_IMAGE } from "../utils/imageAssets.js";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function Markets() {
  const [markets, setMarkets] = useState(null);
  const [error, setError] = useState(null);
  const [day, setDay] = useState("");
  const [search, setSearch] = useState("");

  function load() {
    setError(null);
    setMarkets(null);
    const params = new URLSearchParams();
    if (day) params.set("day", day);
    if (search) params.set("search", search);
    api
      .get(`/markets?${params.toString()}`)
      .then((res) => setMarkets(res.data.markets))
      .catch(() => setError("Could not load markets."));
  }

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, search]);

  const clearFilters = () => {
    setSearch("");
    setDay("");
  };

  const points = (markets || [])
    .filter((m) => m.latitude && m.longitude)
    .map((m) => ({
      id: m._id,
      lat: m.latitude,
      lng: m.longitude,
      title: m.name,
      subtitle: m.address,
    }));
console.log("Map Points:", points);
  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-mint-300 to-lime-300">Farmers Markets</span>
          </h1>
          <p className="text-sage-100/80 text-sm sm:text-base mt-2 max-w-xl">
            Find local produce hubs near you, explore opening schedules, and see vendor stalls live.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 p-4 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-sage-300/60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search markets by name or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-900/60 border border-white/10 text-white placeholder:text-sage-300/50 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition text-sm"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <Filter className="w-4 h-4 absolute left-3.5 top-3.5 text-sage-300/60 pointer-events-none" />
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-900/60 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 appearance-none transition cursor-pointer text-sm"
            >
              <option value="" className="bg-forest-900 text-white">Any Day</option>
              {DAYS.map((d) => (
                <option key={d} value={d} className="bg-forest-900 text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {(search || day) && (
            <button
              onClick={clearFilters}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sage-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Interactive Map View */}
        {points.length > 0 && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-3d-card">
            <MapView points={points} height="360px" zoom={11} />
          </div>
        )}

        {/* Dynamic States & Cards Grid */}
        {error && <ErrorState message={error} onRetry={load} />}
        {!error && markets === null && <SkeletonGrid count={6} />}
        {!error && markets && markets.length === 0 && (
          <EmptyState
            title="No markets found"
            message="Try widening your search terms or selecting another day."
            icon={MapPin}
          />
        )}

        {!error && markets && markets.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map((m) => {
              const operatingText = Array.isArray(m.operatingDays)
                ? m.operatingDays.join(", ")
                : "Schedule N/A";

              return (
                <Link
                  key={m._id}
                  to={`/markets/${m._id}`}
                  className="group relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-gradient-card backdrop-blur-xl shadow-3d-card hover:shadow-3d-card-hover hover:border-emerald-500/50 transition-all duration-300 flex flex-col"
                >
                  <div className="h-44 overflow-hidden bg-forest-900/40 relative">
                    <img
                      src={m.imageUrl || MARKET_STALL_IMAGE}
                      alt={m.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = MARKET_STALL_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-transparent to-transparent opacity-80" />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-xl text-white group-hover:text-emerald-400 transition-colors">
                        {m.name}
                      </h3>
                      {m.address && (
                        <p className="flex items-center gap-2 text-xs text-sage-100/80 mt-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{m.address}</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-sage-300/80">
                      <p className="flex items-center gap-1.5 truncate max-w-[60%]">
                        <Calendar className="w-3.5 h-3.5 text-mint-300 shrink-0" />
                        <span className="truncate">{operatingText}</span>
                      </p>
                      {(m.openTime || m.closeTime) && (
                        <span className="font-semibold text-emerald-300 shrink-0">
                          {m.openTime || "N/A"} - {m.closeTime || "N/A"}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
