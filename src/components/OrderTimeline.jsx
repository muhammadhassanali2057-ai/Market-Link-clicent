import React from "react";
import { Clock, CheckCircle2, Package, ShoppingBag, XCircle, Ban } from "lucide-react";

const STEPS = [
  { key: "PLACED", label: "Placed", icon: ShoppingBag },
  { key: "ACCEPTED", label: "Accepted", icon: CheckCircle2 },
  { key: "READY_FOR_PICKUP", label: "Ready for Pickup", icon: Package },
  { key: "COMPLETED", label: "Completed", icon: CheckCircle2 },
];

const TERMINAL_NEGATIVE = {
  DECLINED: { label: "Declined", icon: XCircle },
  CANCELLED: { label: "Cancelled", icon: Ban },
};

/**
 * Visual step tracker for an order's lifecycle. Styled for Dark Glassmorphism.
 * Includes status notes, history timestamps, and terminal state overlays.
 */
export default function OrderTimeline({ status, statusHistory = [] }) {
  // Terminal negative status handler
  if (TERMINAL_NEGATIVE[status]) {
    const { label, icon: Icon } = TERMINAL_NEGATIVE[status];
    const historyEntry = statusHistory.find((h) => h.status === status);
    const historyNote = historyEntry?.note;
    const timestamp = historyEntry?.timestamp
      ? new Date(historyEntry.timestamp).toLocaleString([], {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : null;

    return (
      <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 backdrop-blur-xl shadow-lg">
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm text-rose-300">{label}</p>
            {timestamp && (
              <span className="text-[11px] text-rose-300/60 font-mono">
                {timestamp}
              </span>
            )}
          </div>
          <p className="text-xs text-rose-200/70 mt-1 leading-relaxed">
            {historyNote || "Order processing was discontinued for this purchase."}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="relative py-2">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const done = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const Icon = step.icon;

          // Extract timestamp if available in statusHistory
          const stepHistory = statusHistory.find((h) => h.status === step.key);
          const formattedTime = stepHistory?.timestamp
            ? new Date(stepHistory.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center text-center flex-1 z-10">
                {/* Step Icon Badge */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                    done
                      ? "bg-forest-900 border-emerald-500/50 text-emerald-400 shadow-glow-emerald"
                      : "bg-white/5 border-white/10 text-sage-100/30"
                  } ${
                    isCurrent
                      ? "ring-2 ring-emerald-400/50 scale-110 bg-emerald-500/10"
                      : ""
                  }`}
                >
                  {done ? (
                    <Icon className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                {/* Label & Timestamp */}
                <span
                  className={`mt-2.5 text-xs font-medium transition-colors ${
                    done ? "text-white" : "text-sage-100/40"
                  }`}
                >
                  {step.label}
                </span>

                {formattedTime && (
                  <span className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                    {formattedTime}
                  </span>
                )}
              </div>

              {/* Progress Connector Line */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-[2px] mx-[-12px] mb-6 relative z-0">
                  <div
                    className={`h-full transition-all duration-500 ${
                      i < currentIndex
                        ? "bg-gradient-to-r from-emerald-500 to-mint-300 shadow-glow-emerald"
                        : "bg-white/10"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}