import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, Circle } from "lucide-react";
import api from "../api/axios.js";
import { EmptyState, ErrorState } from "../components/StateViews.jsx";

export default function Notifications() {
  const [notifications, setNotifications] = useState(null);
  const [error, setError] = useState(null);

  function load() {
    setError(null);
    setNotifications(null);
    api
      .get("/notifications")
      .then((res) => setNotifications(res.data.notifications || []))
      .catch(() => setError("Could not load notifications."));
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(n) {
    if (n.isRead) return;

    // Optimistic UI update
    setNotifications((prev) =>
      (prev || []).map((x) => (x._id === n._id ? { ...x, isRead: true } : x))
    );

    try {
      await api.put(`/notifications/${n._id}/read`);
    } catch {
      // Revert if API request fails
      setNotifications((prev) =>
        (prev || []).map((x) => (x._id === n._id ? { ...x, isRead: false } : x))
      );
    }
  }

  async function markAll() {
    const previousState = [...(notifications || [])];

    // Optimistic UI update
    setNotifications((prev) =>
      (prev || []).map((x) => ({ ...x, isRead: true }))
    );

    try {
      await api.put("/notifications/read-all");
    } catch {
      setNotifications(previousState);
    }
  }

  const unreadCount = (notifications || []).filter((n) => !n.isRead).length;

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-3">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-sage-100/70 text-xs sm:text-sm mt-1">
              Stay updated with market schedules, vendor posts, and activity alerts.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAll}
              className="px-3 py-1.5 rounded-xl bg-forest-900/60 hover:bg-forest-900 border border-white/10 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shrink-0"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all as read</span>
            </button>
          )}
        </div>

        {/* Error View */}
        {error && <ErrorState message={error} onRetry={load} />}

        {/* Loading State Skeleton */}
        {!error && notifications === null && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-forest-900/40 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!error && notifications && notifications.length === 0 && (
          <EmptyState
            title="No notifications yet"
            message="We'll notify you when there are updates on your favorite markets or vendors."
            icon={Bell}
          />
        )}

        {/* Notifications List */}
        {!error && notifications && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((n) => (
              <Link
                key={n._id}
                to={n.link || "#"}
                onClick={() => markRead(n)}
                className={`group relative block p-4 sm:p-5 rounded-2xl border transition-all duration-200 backdrop-blur-xl shadow-3d-card ${
                  n.isRead
                    ? "bg-gradient-card/60 border-white/5 hover:border-white/20 opacity-80"
                    : "bg-gradient-card border-emerald-500/30 hover:border-emerald-500/60 shadow-emerald-500/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                      )}
                      <p
                        className={`text-sm sm:text-base leading-snug transition-colors ${
                          n.isRead
                            ? "text-sage-100/80 group-hover:text-white"
                            : "text-white font-medium group-hover:text-emerald-300"
                        }`}
                      >
                        {n.message}
                      </p>
                    </div>
                    <p className="text-xs text-sage-300/60 mt-2 pl-4">
                      {new Date(n.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  {!n.isRead && (
                    <span className="text-xs text-emerald-400 font-semibold shrink-0 pt-0.5">
                      New
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}