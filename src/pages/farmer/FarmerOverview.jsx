import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Package, Clock, CheckCircle2, DollarSign, AlertTriangle, TrendingUp, Award } from "lucide-react";
import api from "../../api/axios.js";
import { ErrorState } from "../../components/StateViews.jsx";

function StatCard({ icon: Icon, label, value, accent, bgAccent }) {
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

export default function FarmerOverview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  function load() {
    api.get("/analytics/farmer").then((res) => setData(res.data)).catch(() => setError("Could not load your analytics."));
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
      <div className="relative min-h-screen bg-brand-dark py-12 px-4 text-sage-300 flex items-center justify-center">
        <div className="animate-pulse text-sm font-medium">Loading overview...</div>
      </div>
    );

  const trend = data.revenueTrend.map((t) => ({ week: t._id, revenue: t.revenue }));

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Farmer Overview
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-8">
          Monitor your stall's performance, revenue, and order status.
        </p>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Package} label="Total Orders" value={data.totalOrders} />
          <StatCard icon={Clock} label="Pending" value={data.pendingOrders} bgAccent="bg-amber-500/10 border-amber-500/20 text-amber-400" />
          <StatCard icon={CheckCircle2} label="Ready" value={data.readyOrders} bgAccent="bg-sky-500/10 border-sky-500/20 text-sky-400" />
          <StatCard icon={DollarSign} label="Revenue" value={`Rs. ${data.totalRevenue}`} />
          <StatCard icon={AlertTriangle} label="Low Stock" value={data.lowStockCount} bgAccent="bg-red-500/10 border-red-500/20 text-red-400" />
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="p-6 rounded-3xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card">
            <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Revenue Trend (Last 8 Weeks)
            </h3>
            {trend.length === 0 ? (
              <p className="text-xs text-sage-300 py-10 text-center">No completed orders yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={trend}>
                  <XAxis dataKey="week" stroke="#8ba88e" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#8ba88e" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b1f14", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Best Selling Products Chart */}
          <div className="p-6 rounded-3xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card">
            <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-mint-300" /> Best-Selling Products
            </h3>
            {data.bestSelling.length === 0 ? (
              <p className="text-xs text-sage-300 py-10 text-center">No completed orders yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={data.bestSelling}>
                  <XAxis dataKey="name" stroke="#8ba88e" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis stroke="#8ba88e" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b1f14", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                  />
                  <Bar dataKey="unitsSold" fill="#34d399" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}