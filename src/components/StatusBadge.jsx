import React from "react";

const COLORS = {
  PLACED: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  ACCEPTED: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
  READY_FOR_PICKUP: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  COMPLETED: "bg-emerald-500 text-forest-950 font-bold shadow-sm",
  CANCELLED: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
  DECLINED: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
  AVAILABLE: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  SOLD_OUT: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
  HIDDEN: "bg-white/5 text-sage-300/60 border border-white/10",
  ACTIVE: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  PENDING_APPROVAL: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  SUSPENDED: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
  DEACTIVATED: "bg-white/5 text-sage-300/60 border border-white/10",
};

export default function StatusBadge({ status }) {
  const formattedStatus = status
    ? status.replace(/_/g, " ").toLowerCase()
    : "unknown";

  return (
    <span
      className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize backdrop-blur-md transition-colors ${
        COLORS[status] || "bg-white/5 text-sage-300/60 border border-white/10"
      }`}
    >
      {formattedStatus}
    </span>
  );
}