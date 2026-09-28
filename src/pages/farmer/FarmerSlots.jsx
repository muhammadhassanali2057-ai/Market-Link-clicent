import React, { useEffect, useState } from "react";
import { Calendar, Trash2, Clock, Plus } from "lucide-react";
import api from "../../api/axios.js";
import { EmptyState, ErrorState } from "../../components/StateViews.jsx";

export default function FarmerSlots() {
  const [slots, setSlots] = useState(null);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  function load() {
    api.get("/pickup-slots/mine").then((res) => setSlots(res.data.slots)).catch(() => setError("Could not load pickup slots."));
  }
  useEffect(load, []);

  async function generate() {
    setGenerating(true);
    try {
      const res = await api.post("/pickup-slots/generate", { weeks: 4 });
      alert(`Generated ${res.data.created} new pickup slots.`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not generate slots. Add a pickup window to your profile first.");
    } finally {
      setGenerating(false);
    }
  }

  async function remove(id) {
    if (!confirm("Remove this pickup slot?")) return;
    try {
      await api.delete(`/pickup-slots/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove slot.");
    }
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Pickup Slots
          </h1>
          <button
            onClick={generate}
            disabled={generating}
            className="py-2.5 px-5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card disabled:opacity-50 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> {generating ? "Generating..." : "Generate Next 4 Weeks"}
          </button>
        </div>
        <p className="text-xs sm:text-sm text-sage-300 mb-8">
          Slots are generated automatically from your profile's pickup windows. Customers book before cutoff time.
        </p>

        {error && <ErrorState message={error} onRetry={load} />}

        {!error && slots === null && (
          <div className="py-12 text-center text-sage-300 text-sm animate-pulse">Loading pickup slots...</div>
        )}

        {!error && slots && slots.length === 0 && (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center">
            <EmptyState title="No pickup slots yet" message="Set a pickup window in your profile, then generate slots." icon={Calendar} />
          </div>
        )}

        {!error && slots && slots.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((s) => (
              <div
                key={s._id}
                className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex flex-col justify-between hover:border-emerald-500/30 transition duration-300"
              >
                <div>
                  <p className="font-bold text-white text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    {new Date(s.date).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-sage-300 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-mint-300" /> {s.startTime} - {s.endTime}
                  </p>
                  <div className="mt-3 inline-block text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    {s.bookedCount} / {s.capacity} booked
                  </div>
                </div>

                <button
                  onClick={() => remove(s._id)}
                  disabled={s.bookedCount > 0}
                  className="mt-4 text-xs text-red-400 hover:underline flex items-center gap-1 disabled:opacity-30 disabled:no-underline"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Slot
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}