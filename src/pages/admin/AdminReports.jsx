import React, { useEffect, useState } from "react";
import { FileText, Megaphone, Send } from "lucide-react";
import api from "../../api/axios.js";
import { ErrorState } from "../../components/StateViews.jsx";

export default function AdminReports() {
  const [reports, setReports] = useState(null);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [targetRole, setTargetRole] = useState("ALL");
  const [announceMsg, setAnnounceMsg] = useState("");

  function load() {
    api.get("/admin/reports").then((res) => setReports(res.data.reports)).catch(() => setError("Could not load reports."));
  }
  useEffect(load, []);

  async function generate() {
    setGenerating(true);
    try {
      await api.get("/admin/reports/sales-summary");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not generate report.");
    } finally {
      setGenerating(false);
    }
  }

  async function sendAnnouncement() {
    if (!announcement.trim()) return;
    try {
      const res = await api.post("/notifications/announce", { message: announcement, targetRole });
      setAnnounceMsg(res.data.message);
      setAnnouncement("");
    } catch (err) {
      setAnnounceMsg(err.response?.data?.message || "Could not send announcement.");
    }
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Reports Section */}
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                Reports & Analytics
              </h1>
              <p className="text-xs sm:text-sm text-sage-300 mt-1">Generate sales reports and view summaries.</p>
            </div>
            <button
              onClick={generate}
              disabled={generating}
              className="py-2.5 px-5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card disabled:opacity-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> {generating ? "Generating..." : "Generate Sales Summary (30 Days)"}
            </button>
          </div>

          {error && <ErrorState message={error} onRetry={load} />}
          {!error && reports === null && <p className="text-sage-300 text-sm animate-pulse">Loading reports...</p>}
          {!error && reports && reports.length === 0 && <p className="text-sage-300 text-xs">No reports generated yet.</p>}

          {!error && reports && reports.length > 0 && (
            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r._id} className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card">
                  <p className="font-bold text-white text-base">{r.reportType.replaceAll("_", " ")}</p>
                  <p className="text-xs text-sage-300/80 mb-3">
                    Generated {new Date(r.createdAt).toLocaleString()}
                  </p>
                  {r.reportType === "SALES_SUMMARY" && (
                    <div className="bg-forest-900/40 p-3 rounded-xl border border-white/5 space-y-2">
                      <p className="text-xs font-semibold text-emerald-400">
                        Total Orders: {r.data.totalOrders} · Revenue: Rs. {r.data.totalRevenue}
                      </p>
                      {r.data.topFarmers?.length > 0 && (
                        <div className="text-xs text-sage-200">
                          <p className="font-bold text-white mb-1">Top Farmers:</p>
                          {r.data.topFarmers.map((f, i) => (
                            <p key={i}>
                              {f.farmer} — <span className="text-emerald-300">Rs. {f.revenue}</span> ({f.orders} orders)
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements Section */}
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-4 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-400" /> Platform Announcement
          </h2>
          <div className="p-6 rounded-3xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card max-w-xl space-y-4">
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Write an announcement broadcast message..."
              className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-4 py-3 text-xs text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500"
              rows={3}
            />
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL" className="bg-brand-dark">All users</option>
              <option value="CUSTOMER" className="bg-brand-dark">Customers only</option>
              <option value="FARMER" className="bg-brand-dark">Farmers only</option>
            </select>
            <button
              onClick={sendAnnouncement}
              className="w-full py-3 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Broadcast Announcement
            </button>
            {announceMsg && <p className="text-xs text-emerald-400 text-center font-medium">{announceMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}