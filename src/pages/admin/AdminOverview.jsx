import React, { useEffect, useState } from "react";
import { Users, Tractor, MapPin, Package, ShoppingBag, DollarSign, Clock } from "lucide-react";
import api from "../../api/axios.js";
import { ErrorState } from "../../components/StateViews.jsx";

function StatCard({ icon: Icon, label, value, bgAccent }) {
  return (
    <div className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex items-center gap-4">
      <div className={`p-3 rounded-xl border ${bgAccent || "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-sage-300 font-semibold">{label}</p>
        <p className="font-display font-bold text-2xl text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  function load() {
    api.get("/admin/overview").then((res) => setData(res.data)).catch(() => setError("Could not load platform overview."));
  }
  useEffect(load, []);

  if (error)
    return (
      <div className="relative min-h-screen bg-brand-dark py-12 px-4 text-white flex items-center justify-center">
        <ErrorState message={error} onRetry={load} />
      </div>
    );

  if (!data)
    return (
      <div className="relative min-h-screen bg-brand-dark py-12 text-sage-300 flex items-center justify-center">
        <div className="animate-pulse text-sm font-medium">Loading platform overview...</div>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Platform Overview
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-8">
          System-wide stats across customers, farmers, orders, and revenue.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Customers" value={data.totalCustomers} />
          <StatCard icon={Tractor} label="Active Farmers" value={data.totalFarmers} />
          {data.pendingFarmers > 0 && (
            <StatCard icon={Clock} label="Pending Approvals" value={data.pendingFarmers} bgAccent="bg-amber-500/10 border-amber-500/20 text-amber-400" />
          )}
          <StatCard icon={MapPin} label="Active Markets" value={data.totalMarkets} />
          <StatCard icon={Package} label="Active Products" value={data.totalProducts} />
          <StatCard icon={ShoppingBag} label="Total Orders" value={data.totalOrders} />
          <StatCard icon={DollarSign} label="Total Revenue" value={`Rs. ${data.totalRevenue}`} />
        </div>
      </div>
    </div>
  );
}