import React, { useEffect, useState } from "react";
import { Search, Eye, EyeOff, Package } from "lucide-react";
import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import { EmptyState, ErrorState } from "../../components/StateViews.jsx";

export default function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  function load() {
    const params = new URLSearchParams({ limit: "50" });
    if (search) params.set("search", search);
    api.get(`/products?${params.toString()}`).then((res) => setProducts(res.data.products)).catch(() => setError("Could not load products."));
  }
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function toggleHidden(p) {
    const status = p.status === "HIDDEN" ? "AVAILABLE" : "HIDDEN";
    await api.put(`/products/${p._id}/moderate`, { status });
    load();
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Moderate Products
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-6">
          Hide or publish individual product listings.
        </p>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-300/70" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-forest-900/60 border border-white/10 text-sm text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {error && <ErrorState message={error} onRetry={load} />}

        {!error && products === null && (
          <div className="py-12 text-center text-sage-300 text-sm animate-pulse">Loading products...</div>
        )}

        {!error && products && products.length === 0 && (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center">
            <EmptyState title="No products found" message="Try a different query." icon={Package} />
          </div>
        )}

        {!error && products && products.length > 0 && (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p._id}
                className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex items-center justify-between flex-wrap gap-4 hover:border-emerald-500/30 transition duration-300"
              >
                <div>
                  <p className="font-bold text-white text-base">{p.name}</p>
                  <p className="text-xs text-sage-300 mt-0.5">
                    {p.farmer?.stallName} · {p.market?.name} · <span className="text-emerald-400 font-semibold">Rs. {p.price}/{p.unit}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={p.status} />
                  <button
                    onClick={() => toggleHidden(p)}
                    className="px-4 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-sage-300 hover:text-white hover:bg-forest-900/60 transition flex items-center gap-1.5"
                  >
                    {p.status === "HIDDEN" ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
                    {p.status === "HIDDEN" ? "Unhide" : "Hide Listing"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}