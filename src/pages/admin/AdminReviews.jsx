import React, { useEffect, useState } from "react";
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import api from "../../api/axios.js";
import StarRating from "../../components/StarRating.jsx";
import { EmptyState, ErrorState } from "../../components/StateViews.jsx";

export default function AdminReviews() {
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState(null);

  async function load() {
    try {
      const farmersRes = await api.get("/farmers?limit=50");
      const all = await Promise.all(
        farmersRes.data.farmers.map((f) =>
          api.get(`/reviews?targetType=FARMER&targetId=${f._id}`).then((r) =>
            r.data.reviews.map((rev) => ({ ...rev, farmerName: f.stallName }))
          )
        )
      );
      setReviews(all.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {
      setError("Could not load reviews.");
    }
  }
  useEffect(() => { load(); }, []);

  async function moderate(review, hide) {
    await api.put(`/reviews/${review._id}/moderate`, { isModerated: hide });
    load();
  }

  if (error)
    return (
      <div className="relative min-h-screen bg-brand-dark py-12 px-4 text-white flex items-center justify-center">
        <ErrorState message={error} onRetry={load} />
      </div>
    );

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Moderate Reviews
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-8">
          Review customer feedback across all farmers and hide inappropriate entries.
        </p>

        {reviews === null && (
          <div className="py-12 text-center text-sage-300 text-sm animate-pulse">Loading reviews...</div>
        )}

        {reviews && reviews.length === 0 && (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center">
            <EmptyState title="No reviews yet" message="Submitted customer reviews will appear here." icon={MessageSquare} />
          </div>
        )}

        {reviews && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card hover:border-emerald-500/30 transition duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-white text-sm">{r.customer?.name}</span>
                    <span className="text-xs text-sage-300/80 ml-2">on {r.farmerName}</span>
                  </div>
                  <StarRating value={r.rating} size="w-3.5 h-3.5" />
                </div>
                {r.comment && <p className="text-xs text-sage-300 mt-1">{r.comment}</p>}

                <button
                  onClick={() => moderate(r, !r.isModerated)}
                  className="text-xs font-semibold text-red-400 hover:underline mt-3 flex items-center gap-1"
                >
                  {r.isModerated ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {r.isModerated ? "Unhide review" : "Hide review"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}