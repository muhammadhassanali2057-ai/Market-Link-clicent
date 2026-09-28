import React, { useEffect, useState } from "react";
import { Tractor, CheckCircle, Ban, RefreshCw } from "lucide-react";
import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import { EmptyState, ErrorState } from "../../components/StateViews.jsx";

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  function load() {
    api.get("/farmers/admin/all").then((res) => setFarmers(res.data.farmers)).catch(() => setError("Could not load farmers."));
  }
  useEffect(load, []);

  async function setStatus(userId, status) {
    try {
      await api.put(`/farmers/admin/${userId}/status`, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update farmer status.");
    }
  }

  const filtered = (farmers || []).filter((f) => !filter || f.user.status === filter);

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Manage Farmers
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-6">
          Approve, suspend, or reactivate farmer accounts.
        </p>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {["", "PENDING_APPROVAL", "ACTIVE", "SUSPENDED"].map((s) => (
            <button
              key={s || "all"}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition duration-300 ${
                filter === s
                  ? "bg-gradient-btn text-white shadow-3d-card"
                  : "bg-forest-900/60 text-sage-300 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {s ? s.replaceAll("_", " ") : "All Statuses"}
            </button>
          ))}
        </div>

        {error && <ErrorState message={error} onRetry={load} />}

        {!error && farmers === null && (
          <div className="py-12 text-center text-sage-300 text-sm animate-pulse">Loading farmers...</div>
        )}

        {!error && filtered.length === 0 && (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center">
            <EmptyState title="No farmers found" message="No farmers match this filter status." icon={Tractor} />
          </div>
        )}

        {!error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map(({ user, profile }) => (
              <div
                key={user._id}
                className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex items-center justify-between flex-wrap gap-4 hover:border-emerald-500/30 transition duration-300"
              >
                <div>
                  <p className="font-bold text-white text-base">{profile?.stallName || user.name}</p>
                  <p className="text-xs text-sage-300 mt-0.5">
                    {user.email} · {user.contactNumber || "No contact"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={user.status} />
                  {user.status === "PENDING_APPROVAL" && (
                    <button
                      onClick={() => setStatus(user._id, "ACTIVE")}
                      className="px-4 py-1.5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card hover:scale-105 transition flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {user.status === "ACTIVE" && (
                    <button
                      onClick={() => setStatus(user._id, "SUSPENDED")}
                      className="px-4 py-1.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/10 text-xs font-semibold hover:bg-red-500/20 transition flex items-center gap-1"
                    >
                      <Ban className="w-3.5 h-3.5" /> Suspend
                    </button>
                  )}
                  {user.status === "SUSPENDED" && (
                    <button
                      onClick={() => setStatus(user._id, "ACTIVE")}
                      className="px-4 py-1.5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card hover:scale-105 transition flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}