import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, CheckCircle2, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { EmptyState } from "../components/StateViews.jsx";

export default function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [slots, setSlots] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!cart.farmerId) return;
    api
      .get(`/pickup-slots?farmer=${cart.farmerId}`)
      .then((res) => setSlots(res.data.slots))
      .catch(() => setSlots([]));
  }, [cart.farmerId]);

  if (!cart.farmerId && !success) {
    return (
      <div className="relative min-h-screen bg-brand-dark py-16 px-4 text-white overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-xl w-full text-center space-y-6 p-8 rounded-3xl bg-gradient-card backdrop-blur-2xl border border-white/10 shadow-3d-card">
          <EmptyState title="Nothing to check out" message="Add some products to your cart before selecting a pickup slot." />
          <Link
            to="/products"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-btn text-white font-bold text-sm shadow-3d-card hover:shadow-3d-card-hover hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  async function placeOrder() {
    if (!selectedSlot) return setError("Please select a pickup date and time.");
    setPlacing(true);
    setError("");
    try {
      const res = await api.post("/orders", {
        farmerId: cart.farmerId,
        pickupSlotId: selectedSlot,
        items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      setSuccess(res.data.order);
      cart.clearCart();
    } catch (err) {
      setError(err.response?.data?.message || "Could not place your order.");
    } finally {
      setPlacing(false);
    }
  }

  // Success Confirmation Screen
  if (success) {
    return (
      <div className="relative min-h-screen bg-brand-dark py-16 px-4 text-white overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-lg w-full text-center space-y-6 p-8 rounded-3xl bg-gradient-card backdrop-blur-2xl border border-white/10 shadow-3d-card">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="font-display font-extrabold text-3xl text-white">Pre-Order Placed!</h1>

          <p className="text-sage-100/80 text-sm sm:text-base leading-relaxed">
            Your pre-order (<strong className="text-emerald-400">Rs. {success.totalAmount}</strong>) has been submitted to the farmer. You can track its status under your account.
          </p>

          <div className="p-4 rounded-2xl bg-forest-900/60 border border-white/10 text-xs text-sage-300 text-left space-y-1">
            <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Pay In Person
            </p>
            <p>Payment will be collected at the market stall during your designated slot.</p>
          </div>

          <Link
            to="/orders"
            className="block w-full py-3.5 rounded-xl bg-gradient-btn text-white font-bold text-sm shadow-3d-card hover:shadow-3d-card-hover hover:scale-105 active:scale-95 transition-all duration-300"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-sage-300 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Select Pickup Slot
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-8">
          Choose an available pickup window from stall: <strong className="text-emerald-300">{cart.farmerName}</strong>
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Pickup Slots List */}
        {slots === null ? (
          <div className="p-8 text-center text-sage-300 text-sm animate-pulse">
            Loading available pickup slots...
          </div>
        ) : slots.length === 0 ? (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center">
            <EmptyState
              title="No pickup slots available"
              message="This farmer does not have any scheduled pickup windows currently."
              icon={Calendar}
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {slots.map((s) => {
              const isSelected = selectedSlot === s._id;
              const spotsLeft = s.capacity - s.bookedCount;

              return (
                <button
                  key={s._id}
                  onClick={() => setSelectedSlot(s._id)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-500/10 shadow-3d-card scale-[1.02]"
                      : "border-white/10 bg-gradient-card hover:border-emerald-500/40"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-sm text-white">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>
                      {new Date(s.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-sage-300 mt-2">
                    <Clock className="w-3.5 h-3.5 text-mint-300" />
                    <span>
                      {s.startTime} - {s.endTime}
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-300/80 mt-3 font-medium">
                    {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} remaining
                  </p>

                  {isSelected && (
                    <div className="absolute top-3 right-3 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Order Summary Box */}
        <div className="mt-8 p-6 rounded-3xl bg-gradient-card backdrop-blur-2xl border border-white/10 shadow-3d-card space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Order Summary</h3>

          <div className="space-y-2 border-t border-white/10 pt-3">
            {cart.items.map((i) => (
              <div key={i.productId} className="flex justify-between text-xs sm:text-sm text-sage-100/80">
                <span>
                  {i.name} <span className="text-sage-300 font-semibold">× {i.quantity}</span>
                </span>
                <span className="font-semibold text-white">Rs. {i.price * i.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center font-bold text-base pt-3 border-t border-white/10">
            <span className="text-sage-300">Total (Pay at Pickup)</span>
            <span className="font-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-mint-300 to-lime-300">
              Rs. {cart.total}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={placeOrder}
          disabled={placing || !selectedSlot}
          className="mt-8 w-full py-4 rounded-xl bg-gradient-btn text-white font-bold text-sm shadow-3d-card hover:shadow-3d-card-hover hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
        >
          {placing ? "Confirming Pre-Order..." : "Confirm Pre-Order"}
        </button>
      </div>
    </div>
  );
}