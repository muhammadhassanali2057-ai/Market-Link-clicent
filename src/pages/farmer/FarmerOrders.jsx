import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Phone, User, Package } from "lucide-react";
import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import { EmptyState, ErrorState } from "../../components/StateViews.jsx";
import Toast from "../../components/Toast.jsx"; // <-- Toast import kiya gaya hai

const NEXT_ACTIONS = {
  PLACED: [
    { status: "ACCEPTED", label: "Accept", cls: "bg-gradient-btn text-white shadow-3d-card" },
    { status: "DECLINED", label: "Decline", cls: "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20" },
  ],
  ACCEPTED: [{ status: "READY_FOR_PICKUP", label: "Mark Ready", cls: "bg-gradient-btn text-white shadow-3d-card" }],
  READY_FOR_PICKUP: [{ status: "COMPLETED", label: "Complete", cls: "bg-gradient-btn text-white shadow-3d-card" }],
};

export default function FarmerOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null); // <-- Toast state

  function load() {
    const params = status ? `?status=${status}` : "";
    api.get(`/orders/farmer${params}`).then((res) => setOrders(res.data.orders)).catch(() => setError("Could not load orders."));
  }
  useEffect(load, [status]);

  async function updateStatus(order, newStatus) {
    if (newStatus === "DECLINED" && !confirm("Decline this order? Stock will be restored.")) return;
    setBusyId(order._id);
    try {
      await api.put(`/orders/${order._id}/status`, { status: newStatus });
      setToastMessage(`Order status updated to ${newStatus.replaceAll("_", " ")}!`);
      load();
    } catch (err) {
      setToastMessage(err.response?.data?.message || "Could not update order.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Incoming Orders
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-6">
          Review and update order status for customer pickups.
        </p>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {["", "PLACED", "ACCEPTED", "READY_FOR_PICKUP", "COMPLETED", "DECLINED", "CANCELLED"].map((s) => (
            <button
              key={s || "all"}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition duration-300 ${
                status === s
                  ? "bg-gradient-btn text-white shadow-3d-card"
                  : "bg-forest-900/60 text-sage-300 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {s ? s.replaceAll("_", " ") : "All Orders"}
            </button>
          ))}
        </div>

        {error && <ErrorState message={error} onRetry={load} />}

        {!error && orders === null && (
          <div className="py-12 text-center text-sage-300 text-sm animate-pulse">Loading orders...</div>
        )}

        {!error && orders && orders.length === 0 && (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center">
            <EmptyState title="No orders" message="No orders match this filter." icon={Package} />
          </div>
        )}

        {!error && orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o._id}
                className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card hover:border-emerald-500/30 transition duration-300"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <p className="font-bold text-white text-base flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-400" /> {o.customer?.name}
                      <span className="text-xs text-sage-300/80 font-normal flex items-center gap-1">
                        <Phone className="w-3 h-3 text-mint-300" /> {o.customer?.contactNumber}
                      </span>
                    </p>
                    <p className="text-xs text-sage-300 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {o.pickupSlot ? new Date(o.pickupSlot.date).toLocaleDateString() : "-"}
                      </span>
                      {o.pickupSlot?.startTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-mint-300" />
                          {o.pickupSlot.startTime} - {o.pickupSlot.endTime}
                        </span>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>

                {/* Items snapshot */}
                <div className="bg-forest-900/40 border border-white/5 rounded-xl p-3 mb-4 space-y-1">
                  {o.items.map((i, idx) => (
                    <p key={idx} className="text-xs text-sage-200 flex justify-between">
                      <span>{i.nameSnapshot}</span>
                      <span className="font-medium text-emerald-300">× {i.quantity}</span>
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="font-display font-bold text-emerald-400 text-lg">Rs. {o.totalAmount}</span>

                  <div className="flex items-center gap-2">
                    <Link to={`/orders/${o._id}`} className="text-xs font-semibold text-sage-300 hover:text-white px-3 py-1.5">
                      View Details
                    </Link>

                    {o.status !== "CANCELLED" && o.status !== "COMPLETED" && o.status !== "DECLINED" && (
                      <button
                        disabled={busyId === o._id}
                        onClick={() => updateStatus(o, "CANCELLED")}
                        className="text-xs px-4 py-2 rounded-xl font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                      >
                        Cancel Order
                      </button>
                    )}

                    {(NEXT_ACTIONS[o.status] || []).map((a) => (
                      <button
                        key={a.status}
                        disabled={busyId === o._id}
                        onClick={() => updateStatus(o, a.status)}
                        className={`text-xs px-4 py-2 rounded-xl font-bold transition disabled:opacity-50 ${a.cls}`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}