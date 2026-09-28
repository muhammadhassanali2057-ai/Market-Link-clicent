import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Store, ShoppingBag, MapPin, ExternalLink } from "lucide-react";
import api from "../api/axios.js";
import { EmptyState, ErrorState } from "../components/StateViews.jsx";

export default function Favorites() {
  const [favorites, setFavorites] = useState(null);
  const [details, setDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/favorites")
      .then(async (res) => {
        const favs = res.data.favorites;
        setFavorites(favs);
        const results = await Promise.all(
          favs.map((f) => {
            const path =
              f.targetType === "FARMER"
                ? "farmers"
                : f.targetType === "PRODUCT"
                ? "products"
                : "markets";
            return api
              .get(`/${path}/${f.targetId}`)
              .then((r) => [f._id, r.data])
              .catch(() => [f._id, null]);
          })
        );
        setDetails(Object.fromEntries(results));
      })
      .catch(() => setError("Could not load your favorites."));
  }, []);

  async function removeFavorite(fav) {
    try {
      await api.post("/favorites/toggle", {
        targetType: fav.targetType,
        targetId: fav.targetId,
      });
      setFavorites((prev) => prev.filter((f) => f._id !== fav._id));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  }

  const getTargetIcon = (type) => {
    switch (type) {
      case "FARMER":
        return <Store className="w-4 h-4 text-emerald-400" />;
      case "PRODUCT":
        return <ShoppingBag className="w-4 h-4 text-mint-300" />;
      case "MARKET":
        return <MapPin className="w-4 h-4 text-amber-400" />;
      default:
        return <Heart className="w-4 h-4 text-red-400" />;
    }
  };

  if (error)
    return (
      <div className="relative min-h-screen bg-brand-dark py-16 px-4 text-white flex items-center justify-center">
        <ErrorState message={error} />
      </div>
    );

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-1">
            My Favorites
          </h1>
          <p className="text-xs sm:text-sm text-sage-300">
            Farmers, products, and markets you've saved for quick access.
          </p>
        </div>

        {favorites === null && (
          <div className="py-12 text-center text-sage-300 text-sm animate-pulse">
            Loading your favorites...
          </div>
        )}

        {favorites && favorites.length === 0 && (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center shadow-3d-card">
            <EmptyState
              title="No favorites yet"
              message="Tap the heart icon on any product, farmer, or market to save it here."
              icon={Heart}
            />
          </div>
        )}

        {favorites && favorites.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((f) => {
              const d = details[f._id];
              const item = d?.product || d?.farmer || d?.market;
              const path =
                f.targetType === "FARMER"
                  ? "farmers"
                  : f.targetType === "PRODUCT"
                  ? "products"
                  : "markets";
              const name = item?.name || item?.stallName || "Loading...";

              return (
                <div
                  key={f._id}
                  className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex items-center justify-between gap-4 hover:border-emerald-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="p-2.5 rounded-xl bg-forest-900/60 border border-white/10 shrink-0">
                      {getTargetIcon(f.targetType)}
                    </div>

                    <Link to={`/${path}/${f.targetId}`} className="min-w-0 flex-1">
                      <p className="font-bold text-white text-sm truncate group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                        <span className="truncate">{name}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </p>
                      <span className="inline-block text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-1">
                        {f.targetType}
                      </span>
                    </Link>
                  </div>

                  <button
                    onClick={() => removeFavorite(f)}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    title="Remove from favorites"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}