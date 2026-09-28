import React, { useEffect, useState } from "react";
import { Search, UserCheck, UserX, Users } from "lucide-react";
import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import { EmptyState, ErrorState } from "../../components/StateViews.jsx";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  function load() {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    api.get(`/admin/customers${params}`).then((res) => setCustomers(res.data.customers)).catch(() => setError("Could not load customers."));
  }
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function setStatus(id, status) {
    try {
      await api.put(`/admin/customers/${id}/status`, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update customer status.");
    }
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Manage Customers
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-6">
          View and control registered customer accounts.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-300/70" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-forest-900/60 border border-white/10 text-sm text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {error && <ErrorState message={error} onRetry={load} />}

        {!error && customers === null && (
          <div className="py-12 text-center text-sage-300 text-sm animate-pulse">Loading customers...</div>
        )}

        {!error && customers && customers.length === 0 && (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center">
            <EmptyState title="No customers found" message="Try searching for a different name." icon={Users} />
          </div>
        )}

        {!error && customers && customers.length > 0 && (
          <div className="space-y-3">
            {customers.map((c) => (
              <div
                key={c._id}
                className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex items-center justify-between flex-wrap gap-4 hover:border-emerald-500/30 transition duration-300"
              >
                <div>
                  <p className="font-bold text-white text-base">{c.name}</p>
                  <p className="text-xs text-sage-300 mt-0.5">
                    {c.email} · {c.contactNumber || "No contact info"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <StatusBadge status={c.status} />
                  {c.status === "ACTIVE" ? (
                    <button
                      onClick={() => setStatus(c._id, "DEACTIVATED")}
                      className="px-4 py-1.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/10 text-xs font-semibold hover:bg-red-500/20 transition flex items-center gap-1"
                    >
                      <UserX className="w-3.5 h-3.5" /> Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => setStatus(c._id, "ACTIVE")}
                      className="px-4 py-1.5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card hover:scale-105 transition flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Activate
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