import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, ArrowLeft, Store, Heart } from "lucide-react";
import api from "../api/axios.js";
import MapView from "../components/MapView.jsx";
import StarRating from "../components/StarRating.jsx";
import { ErrorState } from "../components/StateViews.jsx";

export default function MarketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/markets/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setError("Could not load this market."));

    // Check favorite status
    api
      .get("/favorites")
      .then((res) => {
        const found = res.data.favorites?.some(
          (f) => f.targetType === "MARKET" && f.targetId === id
        );
        setIsFavorite(!!found);
      })
      .catch(() => {});
  }, [id]);

  const toggleFavorite = async () => {
    setFavLoading(true);
    try {
      await api.post("/favorites/toggle", {
        targetType: "MARKET",
        targetId: id,
      });
      setIsFavorite((prev) => !prev);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setFavLoading(false);
    }
  };

  if (error)
    return (
      <div className="min-h-screen bg-brand-dark py-16 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <ErrorState message={error} />
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center text-sage-300">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
          <span>Loading market details...</span>
        </div>
      </div>
    );

  const { market, farmers = [] } = data;
  const operatingDaysText = Array.isArray(market?.operatingDays)
    ? market.operatingDays.join(", ")
    : "Days not specified";

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-sage-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Markets
          </button>

          <button
            onClick={toggleFavorite}
            disabled={favLoading}
            className={`p-2.5 rounded-xl border border-white/10 backdrop-blur-xl transition-all flex items-center gap-2 text-xs font-semibold ${
              isFavorite
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-forest-900/60 text-sage-300 hover:text-white"
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span>{isFavorite ? "Saved" : "Save Market"}</span>
          </button>
        </div>

        {/* Market Overview Glass Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-card backdrop-blur-2xl border border-white/10 shadow-3d-card space-y-4">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            {market.name}
          </h1>

          <div className="flex flex-wrap gap-y-2.5 gap-x-6 text-xs sm:text-sm text-sage-100/90">
            {market.address && (
              <p className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{market.address}</span>
              </p>
            )}
            <p className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-mint-300 shrink-0" />
              <span>{operatingDaysText}</span>
            </p>
            {(market.openTime || market.closeTime) && (
              <p className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-lime-300 shrink-0" />
                <span>
                  {market.openTime || "N/A"} - {market.closeTime || "N/A"}
                </span>
              </p>
            )}
          </div>

          {market.description && (
            <p className="text-sm sm:text-base text-sage-100/80 leading-relaxed border-t border-white/10 pt-4">
              {market.description}
            </p>
          )}
        </div>

        {/* Interactive Map */}
        {market.latitude && market.longitude && (
          <div className="my-8 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-3d-card">
            <MapView
              points={[
                {
                  id: market._id,
                  lat: market.latitude,
                  lng: market.longitude,
                  title: market.name,
                  subtitle: market.address,
                },
              ]}
              height="340px"
              zoom={14}
            />
          </div>
        )}

        {/* Vendor Stalls Grid */}
        <div className="mt-12">
          <h2 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" /> Farmers & Stalls at this Market
          </h2>

          {farmers.length === 0 ? (
            <div className="p-6 rounded-2xl bg-gradient-card border border-white/10 text-sage-300 text-sm">
              No farmers are currently listed at this market.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmers.map((f) => (
                <Link
                  key={f._id}
                  to={`/farmers/${f._id}`}
                  className="group p-5 rounded-2xl border border-emerald-500/20 bg-gradient-card backdrop-blur-xl shadow-3d-card hover:shadow-3d-card-hover hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-forest-900/80 border border-white/10 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      🧑‍🌾
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-bold text-lg text-white group-hover:text-emerald-400 transition-colors truncate">
                        {f.stallName}
                      </h3>
                      {f.bio && (
                        <p className="text-xs text-sage-300 line-clamp-1 mt-0.5">
                          {f.bio}
                        </p>
                      )}
                      <div className="mt-2">
                        <StarRating
                          value={f.ratingAverage}
                          count={f.ratingCount}
                          size="w-3.5 h-3.5"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}