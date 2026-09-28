import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, MapPin, Calendar, Star } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import MapView from "../components/MapView.jsx";
import StarRating from "../components/StarRating.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ErrorState } from "../components/StateViews.jsx";
import { MARKET_STALL_IMAGE } from "../utils/imageAssets.js";

export default function FarmerDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [favorited, setFavorited] = useState(false);
  const [favIds, setFavIds] = useState(new Set());

  function load() {
    api
      .get(`/farmers/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setError("Could not load this farmer's profile."));
  }

  useEffect(() => {
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user?.role === "CUSTOMER") {
      api
        .get("/favorites")
        .then((res) => {
          const ids = new Set(
            res.data.favorites
              .filter((f) => f.targetType === "PRODUCT")
              .map((f) => f.targetId)
          );
          setFavIds(ids);
          setFavorited(
            res.data.favorites.some(
              (f) => f.targetType === "FARMER" && f.targetId === id
            )
          );
        })
        .catch(() => {});
    }
  }, [user, id]);

  async function toggleFarmerFavorite() {
    try {
      const res = await api.post("/favorites/toggle", {
        targetType: "FARMER",
        targetId: id,
      });
      setFavorited(res.data.favorited);
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleProductFavorite(product) {
    try {
      const res = await api.post("/favorites/toggle", {
        targetType: "PRODUCT",
        targetId: product._id,
      });
      setFavIds((prev) => {
        const next = new Set(prev);
        if (res.data.favorited) next.add(product._id);
        else next.delete(product._id);
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (error)
    return (
      <div className="relative min-h-screen bg-brand-dark py-16 px-4 text-white overflow-hidden flex items-center justify-center">
        <ErrorState message={error} onRetry={load} />
      </div>
    );

  if (!data)
    return (
      <div className="relative min-h-screen bg-brand-dark py-16 px-4 text-sage-300 overflow-hidden flex items-center justify-center">
        <div className="animate-pulse text-sm font-medium">Loading farmer profile...</div>
      </div>
    );

  const { farmer, products = [], reviews = [] } = data;

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Banner Section */}
        <div className="h-48 sm:h-64 rounded-3xl overflow-hidden mb-8 relative border border-white/10 shadow-3d-card">
          <img
            src={farmer.profileImageUrl || MARKET_STALL_IMAGE}
            alt={farmer.stallName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = MARKET_STALL_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
        </div>

        {/* Header Details */}
        <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              {farmer.stallName}
            </h1>
            <div className="flex items-center gap-2">
              <StarRating value={farmer.ratingAverage} count={farmer.ratingCount} />
            </div>
            {farmer.about && (
              <p className="text-sm text-sage-300 leading-relaxed pt-1">{farmer.about}</p>
            )}
          </div>

          {user?.role === "CUSTOMER" && (
            <button
              onClick={toggleFarmerFavorite}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all duration-300 shadow-3d-card ${
                favorited
                  ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                  : "bg-forest-900/60 border-white/10 text-white hover:border-emerald-500/30 hover:text-emerald-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
              <span>{favorited ? "Favorited" : "Add to favorites"}</span>
            </button>
          )}
        </div>

        {/* Location & Slots Metadata */}
        <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-sage-200 mb-8 p-4 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card">
          {farmer.markets && farmer.markets.length > 0 && (
            <span className="flex items-center gap-2 text-emerald-400 font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{farmer.markets.map((m) => m.name).join(", ")}</span>
            </span>
          )}

          {farmer.pickupWindows && farmer.pickupWindows.length > 0 && (
            <div className="flex flex-wrap gap-3 items-center border-l border-white/10 pl-4">
              {farmer.pickupWindows.map((w, i) => (
                <span key={i} className="flex items-center gap-1.5 text-sage-300">
                  <Calendar className="w-4 h-4 text-mint-300 shrink-0" />
                  <span>
                    {w.day}: {w.startTime} - {w.endTime}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Map View */}
        {farmer.markets?.[0]?.latitude && (
          <div className="mb-10 rounded-3xl border border-white/10 overflow-hidden shadow-3d-card bg-forest-900/40 p-2">
            <MapView
              points={farmer.markets
                .filter((m) => m.latitude)
                .map((m) => ({
                  id: m._id,
                  lat: m.latitude,
                  lng: m.longitude,
                  title: m.name,
                  subtitle: m.address,
                }))}
              height="300px"
            />
          </div>
        )}

        {/* Products Section */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-2xl text-white mb-6 tracking-tight">
            Current Products
          </h2>
          {products.length === 0 ? (
            <div className="p-8 rounded-2xl bg-gradient-card border border-white/10 text-sage-300 text-xs sm:text-sm text-center">
              No products listed right now - check back soon.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={{
                    ...p,
                    farmer: { stallName: farmer.stallName },
                    market: farmer.markets?.[0],
                  }}
                  isFavorited={favIds.has(p._id)}
                  onToggleFavorite={
                    user?.role === "CUSTOMER" ? toggleProductFavorite : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-6 tracking-tight">
            Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <div className="p-8 rounded-2xl bg-gradient-card border border-white/10 text-sage-300 text-xs sm:text-sm text-center">
              No reviews yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="rounded-2xl border border-white/10 bg-gradient-card backdrop-blur-xl p-5 shadow-3d-card space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-white text-sm">
                      {r.customer?.name || "Anonymous Customer"}
                    </span>
                    <StarRating value={r.rating} size="w-3.5 h-3.5" />
                  </div>

                  {r.comment && (
                    <p className="text-xs sm:text-sm text-sage-200 leading-relaxed">
                      {r.comment}
                    </p>
                  )}

                  {r.farmerResponse && (
                    <div className="mt-3 p-3 rounded-xl bg-forest-900/50 border-l-2 border-emerald-500 text-xs text-sage-300 space-y-1">
                      <span className="font-semibold text-emerald-400 block">
                        Farmer Response:
                      </span>
                      <p>{r.farmerResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}