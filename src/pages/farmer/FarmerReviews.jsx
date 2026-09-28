import React, { useEffect, useState } from "react";
import { MessageSquare, Heart } from "lucide-react";
import api from "../../api/axios.js";
import StarRating from "../../components/StarRating.jsx";
import { EmptyState, ErrorState } from "../../components/StateViews.jsx";

export default function FarmerReviews() {
  const [farmerId, setFarmerId] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [error, setError] = useState(null);
  const [responding, setResponding] = useState(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    api
      .get("/farmers/me")
      .then((res) => {
        setFarmerId(res.data.farmer._id);
        return api.get(`/reviews?targetType=FARMER&targetId=${res.data.farmer._id}`);
      })
      .then((res) => setReviews(res.data.reviews))
      .catch(() => setError("Could not load your reviews."));
  }, []);

  async function submitResponse(review) {
    try {
      await api.put(`/reviews/${review._id}/respond`, { response: responseText });
      setReviews((prev) => prev.map((r) => (r._id === review._id ? { ...r, farmerResponse: responseText } : r)));
      setResponding(null);
      setResponseText("");
    } catch (err) {
      alert(err.response?.data?.message || "Could not submit response.");
    }
  }

  if (error)
    return (
      <div className="relative min-h-screen bg-brand-dark py-12 px-4 text-white flex items-center justify-center">
        <ErrorState message={error} />
      </div>
    );

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Stall Reviews
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-8">
          Customer ratings and feedback regarding your products and service.
        </p>

        {reviews === null && (
          <div className="py-12 text-center text-sage-300 text-sm animate-pulse">Loading reviews...</div>
        )}

        {reviews && reviews.length === 0 && (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center">
            <EmptyState title="No reviews yet" message="Reviews from completed orders will show here." icon={MessageSquare} />
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
                  <span className="font-bold text-white text-sm">{r.customer?.name}</span>
                  <StarRating value={r.rating} size="w-4 h-4" />
                </div>
                {r.comment && <p className="text-xs text-sage-300 mt-1">{r.comment}</p>}

                {r.farmerResponse ? (
                  <div className="mt-3 p-3 rounded-xl bg-forest-900/40 border-l-2 border-emerald-400 text-xs text-sage-200">
                    <span className="font-bold text-emerald-400">Your response: </span>
                    {r.farmerResponse}
                  </div>
                ) : responding === r._id ? (
                  <div className="mt-3">
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      className="w-full rounded-xl bg-forest-900/60 border border-white/10 p-3 text-xs text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500"
                      rows={2}
                      placeholder="Write a reply to this review..."
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => submitResponse(r)}
                        className="py-1.5 px-4 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card"
                      >
                        Post Response
                      </button>
                      <button
                        onClick={() => setResponding(null)}
                        className="py-1.5 px-4 rounded-xl border border-white/10 text-xs font-semibold text-sage-300 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setResponding(r._id)}
                    className="text-xs font-semibold text-emerald-400 hover:underline mt-3 block"
                  >
                    Reply to Review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}