import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Star, ArrowLeft } from "lucide-react";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";
import OrderTimeline from "../components/OrderTimeline.jsx";
import { ErrorState } from "../components/StateViews.jsx";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [reviewFor, setReviewFor] = useState(null); // { targetType, targetId, label }
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewedIds, setReviewedIds] = useState(new Set());

  function load() {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order))
      .catch(() => setError("Could not load this order."));
  }
  useEffect(load, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function cancelOrder() {
    if (!confirm("Cancel this order? This cannot be undone.")) return;
    setBusy(true);
    try {
      await api.put(`/orders/${id}/cancel`, {});
      setActionMsg("Order cancelled successfully.");
      load();
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Could not cancel this order.");
    } finally {
      setBusy(false);
    }
  }

  async function submitReview() {
    try {
      await api.post("/reviews", {
        orderId: id,
        targetType: reviewFor.targetType,
        targetId: reviewFor.targetId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewedIds((prev) => new Set(prev).add(reviewFor.targetId));
      setReviewFor(null);
      setReviewForm({ rating: 5, comment: "" });
      setActionMsg("Thanks for your review!");
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Could not submit review.");
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-dark py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <ErrorState message={error} onRetry={load} />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center text-sage-300/60 text-sm">
        Loading order details...
      </div>
    );
  }

  const canCancel = ["PLACED", "ACCEPTED"].includes(order.status);
  const canReview = order.status === "COMPLETED";

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-xl bg-forest-900/60 hover:bg-forest-900 border border-white/10 text-sage-300 hover:text-white text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Header Section */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {order.farmer?.stallName || "Order Details"}
            </h1>
            <p className="text-sm text-sage-100/80 flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {order.market?.name}
                {order.market?.address ? `, ${order.market.address}` : ""}
              </span>
            </p>
            <p className="text-sm text-sage-100/80 flex items-center gap-2 mt-1.5">
              <Calendar className="w-4 h-4 text-mint-300 shrink-0" />
              <span>
                {order.pickupSlot
                  ? new Date(order.pickupSlot.date).toLocaleDateString()
                  : "—"}{" "}
                · {order.pickupSlot?.startTime || ""} -{" "}
                {order.pickupSlot?.endTime || ""}
              </span>
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Timeline Card */}
        <div className="rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 p-6 mb-6 shadow-3d-card">
          <OrderTimeline
            status={order.status}
            statusHistory={order.statusHistory}
          />
        </div>

        {/* Action Message Banner */}
        {actionMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium flex items-center justify-between">
            <span>{actionMsg}</span>
            <button
              onClick={() => setActionMsg("")}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Items Card */}
        <div className="rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 p-6 mb-6 shadow-3d-card">
          <h3 className="font-display font-bold text-lg text-white mb-4">
            Order Items
          </h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start justify-between text-sm py-3 border-b border-white/5 last:border-0"
              >
                <div className="space-y-1">
                  <p className="font-medium text-white">
                    {item.nameSnapshot}{" "}
                    <span className="text-sage-300/70">× {item.quantity}</span>
                  </p>
                  {canReview && (
                    <button
                      onClick={() =>
                        setReviewFor({
                          targetType: "PRODUCT",
                          targetId: item.product,
                          label: item.nameSnapshot,
                        })
                      }
                      disabled={reviewedIds.has(item.product)}
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold disabled:opacity-40 transition"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>
                        {reviewedIds.has(item.product)
                          ? "Product Reviewed"
                          : "Review product"}
                      </span>
                    </button>
                  )}
                </div>
                <span className="font-semibold text-emerald-300">
                  Rs. {item.lineTotal}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between font-semibold pt-4 mt-4 border-t border-white/10 text-base">
            <span className="text-sage-100/90">Total (paid at pickup)</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-mint-300 to-lime-300 text-lg">
              Rs. {order.totalAmount}
            </span>
          </div>
        </div>

        {/* Farmer Review Trigger */}
        {canReview && order.farmer && !reviewFor && (
          <div className="mb-6">
            <button
              onClick={() =>
                setReviewFor({
                  targetType: "FARMER",
                  targetId: order.farmer._id,
                  label: order.farmer.stallName,
                })
              }
              disabled={reviewedIds.has(order.farmer._id)}
              className="px-5 py-2.5 rounded-xl bg-forest-900/60 hover:bg-forest-900 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-2 disabled:opacity-40 transition shadow-lg"
            >
              <Star className="w-4 h-4" />
              <span>
                {reviewedIds.has(order.farmer._id)
                  ? "Farmer Reviewed"
                  : `Review ${order.farmer.stallName}`}
              </span>
            </button>
          </div>
        )}

        {/* Review Form Card */}
        {reviewFor && (
          <div className="mb-6 p-6 rounded-2xl border border-emerald-500/30 bg-gradient-card backdrop-blur-xl shadow-3d-card animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-bold text-lg text-white">
                Rate & Review:{" "}
                <span className="text-emerald-400">{reviewFor.label}</span>
              </p>
              <button
                onClick={() => setReviewFor(null)}
                className="text-sage-300 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center gap-1.5 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-6 h-6 ${
                      n <= reviewForm.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-sage-300/30"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-amber-400">
                {reviewForm.rating} / 5
              </span>
            </div>

            <textarea
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm((f) => ({ ...f, comment: e.target.value }))
              }
              placeholder="Share your experience (optional)..."
              className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-4 py-3 text-white text-sm placeholder:text-sage-300/50 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition mb-4 resize-none"
              rows={3}
            />

            <div className="flex items-center gap-3">
              <button
                onClick={submitReview}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-mint-400 text-brand-dark font-semibold text-sm hover:brightness-110 transition shadow-lg shadow-emerald-500/20"
              >
                Submit Review
              </button>
              <button
                onClick={() => setReviewFor(null)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sage-300 text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Cancel Order Button */}
        {canCancel && (
          <div className="mb-8">
            <button
              onClick={cancelOrder}
              disabled={busy}
              className="px-5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm transition disabled:opacity-50"
            >
              {busy ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        )}

        {/* Status History Card */}
        <div className="rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 p-6 shadow-3d-card">
          <h3 className="font-display font-bold text-sm text-sage-300/80 uppercase tracking-wider mb-3">
            Status History
          </h3>
          <div className="space-y-2">
            {order.statusHistory?.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0"
              >
                <span className="text-white font-medium">
                  {h.status}
                  {h.note ? ` — ${h.note}` : ""}
                </span>
                <span className="text-sage-300/60">
                  {new Date(h.changedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}