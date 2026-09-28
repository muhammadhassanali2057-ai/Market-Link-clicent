import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Calendar, Clock, ArrowRight, ShoppingBag } from "lucide-react";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";
import { EmptyState, ErrorState } from "../components/StateViews.jsx";

const STATUS_FILTERS = ["", "PLACED", "ACCEPTED", "READY_FOR_PICKUP", "COMPLETED", "CANCELLED"];

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");

  function load() {
    setError(null);
    setOrders(null);
    const params = status ? `?status=${status}` : "";
    api
      .get(`/orders/mine${params}`)
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => setError("Could not load your orders."));
  }

  useEffect(load, [status]);

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          My Orders
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-6">
          Track your pre-orders and market pickup status.
        </p>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {STATUS_FILTERS.map((s) => (
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

        {/* Error Handling */}
        {error && <ErrorState message={error} onRetry={load} />}

        {/* Skeleton Loading State */}
        {!error && orders === null && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-forest-900/40 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!error && orders && orders.length === 0 && (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center shadow-3d-card">
            <EmptyState
              title="No orders found"
              message="You haven't placed any pre-orders matching this status yet."
              icon={Package}
            />
          </div>
        )}

        {/* Orders List */}
        {!error && orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o) => {
              const itemCount = (o.items || []).reduce(
                (sum, item) => sum + (item.quantity || 1),
                0
              );

              return (
                <Link
                  key={o._id}
                  to={`/orders/${o._id}`}
                  className="block p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card hover:border-emerald-500/40 hover:scale-[1.01] transition duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                          {o.farmer?.stallName || "Market Stall"}
                        </p>
                        {itemCount > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-sage-300/80 border border-white/10">
                            <ShoppingBag className="w-3 h-3 text-emerald-400" />
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-sage-300">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          {o.pickupSlot?.date
                            ? new Date(o.pickupSlot.date).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </span>
                        {o.pickupSlot?.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-mint-300" />
                            {o.pickupSlot.startTime}
                            {o.pickupSlot?.endTime
                              ? ` - ${o.pickupSlot.endTime}`
                              : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-sage-300 uppercase tracking-wider block">
                          Total Amount
                        </span>
                        <span className="font-display font-bold text-emerald-400 text-lg">
                          Rs. {o.totalAmount}
                        </span>
                      </div>

                      <StatusBadge status={o.status} />

                      <ArrowRight className="w-4 h-4 text-sage-300 group-hover:text-white group-hover:translate-x-1 transition hidden sm:block" />
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