import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Heart, TrendingUp, RotateCcw, ArrowRight, Store, DollarSign, Share2 } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ErrorState } from "../components/StateViews.jsx";
import Toast from "../components/Toast.jsx"; // <-- Toast import kiya gaya hai

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null); // <-- Toast state

  function load() {
    setError(null);
    api
      .get("/customers/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || "Could not load your dashboard.");
      });
  }

  useEffect(() => {
    load();
  }, []);

  // Cancel order handler function with Toast
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Kya aap waqai is order ko cancel karna chahte hain?")) return;
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      setToastMessage("Order successfully cancelled!");
      load();
    } catch (err) {
      setToastMessage(err.response?.data?.message || "Order cancel karne mein nakaam rahe.");
    }
  };

  // Share Profile Handler with Toast
  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/customers/${user?._id || ''}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'MarketLink Customer Profile',
        text: `Check out my profile on MarketLink!`,
        url: profileUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(profileUrl);
      setToastMessage("Profile link copied to clipboard!");
    }
  };

  if (error)
    return (
      <div className="relative min-h-screen bg-brand-dark py-16 px-4 text-white overflow-hidden flex items-center justify-center">
        <ErrorState message={error} onRetry={load} />
      </div>
    );

  if (!data)
    return (
      <div className="relative min-h-screen bg-brand-dark py-16 px-4 text-sage-300 overflow-hidden flex items-center justify-center">
        <div className="animate-pulse text-sm font-medium">Loading dashboard...</div>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Background Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header with Share Profile Button */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Welcome back, {user?.name ? user.name.split(" ")[0] : "Customer"}!
            </h1>
            <p className="text-xs sm:text-sm text-sage-300 mt-1">
              Here's what's happening with your MarketLink account.
            </p>
          </div>

          <button
            onClick={handleShareProfile}
            className="py-2.5 px-4 rounded-xl bg-forest-900/60 hover:bg-forest-900 border border-white/10 hover:border-emerald-500/30 text-xs font-bold text-white transition-all duration-300 inline-flex items-center gap-2 shadow-3d-card"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Share Profile</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-sage-300 font-semibold">Total Spent</p>
              <p className="font-display font-bold text-2xl text-white mt-0.5">
                Rs. {data.spending?.total || 0}
              </p>
              <p className="text-xs text-sage-300/70 mt-0.5">{data.spending?.orders || 0} completed orders</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-mint-300/10 border border-mint-300/20 text-mint-300">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-sage-300 font-semibold">Favorite Farmers</p>
              <p className="font-display font-bold text-2xl text-white mt-0.5">
                {data.favoriteFarmers?.length || 0}
              </p>
              <p className="text-xs text-sage-300/70 mt-0.5">Saved stalls</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-sage-300 font-semibold">Favorite Products</p>
              <p className="font-display font-bold text-2xl text-white mt-0.5">
                {data.favoriteProducts?.length || 0}
              </p>
              <p className="text-xs text-sage-300/70 mt-0.5">Saved items</p>
            </div>
          </div>
        </div>

        {/* Upcoming Pickup Banner */}
        {data.upcomingPickup && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-forest-800/80 via-forest-900/90 to-brand-dark border border-emerald-500/30 shadow-3d-card mb-10 flex items-center justify-between flex-wrap gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="w-4 h-4" /> Upcoming Pickup
              </p>
              <p className="font-display font-bold text-2xl text-white mt-1">
                {data.upcomingPickup.farmer?.stallName || "Market Stall"}
              </p>
              <p className="text-xs sm:text-sm text-sage-200 mt-1">
                {data.upcomingPickup.pickupSlot?.date
                  ? new Date(data.upcomingPickup.pickupSlot.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })
                  : "Date N/A"}{" "}
                · {data.upcomingPickup.pickupSlot?.startTime || "Time N/A"}
              </p>
            </div>
            <Link
              to={`/orders/${data.upcomingPickup._id}`}
              className="relative z-10 py-2.5 px-5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-1.5"
            >
              <span>View Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Recent Orders */}
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-emerald-400" /> Recent Orders
            </h2>
            {!data.recentOrders || data.recentOrders.length === 0 ? (
              <div className="p-6 rounded-2xl bg-gradient-card border border-white/10 text-sage-300 text-xs">
                No orders placed yet.
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentOrders.map((o) => (
                  <div
                    key={o._id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card hover:border-emerald-500/30 transition duration-300"
                  >
                    <Link to={`/orders/${o._id}`} className="flex-1">
                      <p className="font-bold text-white text-sm">{o.farmer?.stallName || "Order"}</p>
                      <p className="text-xs text-sage-300 mt-0.5">Rs. {o.totalAmount}</p>
                    </Link>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={o.status} />

                      {o.status !== "Cancelled" && o.status !== "Completed" && (
                        <button
                          onClick={() => handleCancelOrder(o._id)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold transition duration-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorite Farmers */}
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" /> Favorite Farmers
            </h2>
            {!data.favoriteFarmers || data.favoriteFarmers.length === 0 ? (
              <div className="p-6 rounded-2xl bg-gradient-card border border-white/10 text-sage-300 text-xs">
                You haven't favorited any farmers yet.
              </div>
            ) : (
              <div className="space-y-3">
                {data.favoriteFarmers.map((f) => (
                  <Link
                    key={f._id}
                    to={`/farmers/${f._id}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card hover:border-emerald-500/30 transition duration-300"
                  >
                    <span className="font-bold text-white text-sm">{f.stallName}</span>
                    <span className="text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                      ★ {f.ratingAverage ? f.ratingAverage.toFixed(1) : "New"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommended Products Section */}
        <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-mint-300" /> Recommended For You
        </h2>
        {!data.recommended || data.recommended.length === 0 ? (
          <p className="text-sage-300 text-xs p-6 rounded-2xl bg-gradient-card border border-white/10">
            Order something to get personalized recommendations!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.recommended.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}