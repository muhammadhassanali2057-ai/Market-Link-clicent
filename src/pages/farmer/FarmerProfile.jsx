import React, { useEffect, useState } from "react";
import { Plus, Trash2, Store, Clock, MapPin } from "lucide-react";
import api from "../../api/axios.js";
import { ErrorState } from "../../components/StateViews.jsx";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function FarmerProfile() {
  const [farmer, setFarmer] = useState(null);
  const [accountStatus, setAccountStatus] = useState(null);
  const [allMarkets, setAllMarkets] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    api.get("/farmers/me").then((res) => { setFarmer(res.data.farmer); setAccountStatus(res.data.accountStatus); })
      .catch(() => setError("Could not load your profile."));
  }
  useEffect(load, []);
  useEffect(() => { api.get("/markets?limit=50").then((res) => setAllMarkets(res.data.markets)).catch(() => {}); }, []);

  function updateField(field, value) {
    setFarmer((f) => ({ ...f, [field]: value }));
  }

  function toggleMarket(marketId) {
    setFarmer((f) => {
      const has = f.markets.some((m) => (m._id || m) === marketId);
      return {
        ...f,
        markets: has ? f.markets.filter((m) => (m._id || m) !== marketId) : [...f.markets, { _id: marketId }],
      };
    });
  }

  function addWindow() {
    setFarmer((f) => ({ ...f, pickupWindows: [...f.pickupWindows, { day: "SAT", startTime: "08:00", endTime: "12:00", cutoffMinutesBefore: 120 }] }));
  }
  function updateWindow(i, field, value) {
    setFarmer((f) => ({ ...f, pickupWindows: f.pickupWindows.map((w, idx) => (idx === i ? { ...w, [field]: value } : w)) }));
  }
  function removeWindow(i) {
    setFarmer((f) => ({ ...f, pickupWindows: f.pickupWindows.filter((_, idx) => idx !== i) }));
  }

  async function save() {
    setSaving(true);
    try {
      await api.put("/farmers/me", {
        stallName: farmer.stallName,
        about: farmer.about,
        markets: farmer.markets.map((m) => m._id || m),
        pickupWindows: farmer.pickupWindows,
        location: farmer.location,
      });
      alert("Profile updated.");
    } catch (err) {
      alert(err.response?.data?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (error)
    return (
      <div className="relative min-h-screen bg-brand-dark py-12 px-4 text-white flex items-center justify-center">
        <ErrorState message={error} />
      </div>
    );

  if (!farmer)
    return (
      <div className="relative min-h-screen bg-brand-dark py-12 text-sage-300 flex items-center justify-center">
        <div className="animate-pulse text-sm font-medium">Loading profile...</div>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Stall Profile
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-6">
          Update stall information, assigned markets, and weekly pickup windows.
        </p>

        {accountStatus === "PENDING_APPROVAL" && (
          <div className="mb-6 text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-2xl">
            Your account is pending admin approval. Products won't be visible to customers until approved.
          </div>
        )}

        <div className="space-y-5 p-6 rounded-3xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card">
          <div>
            <label className="text-xs font-semibold text-sage-300 block mb-1">Stall / Business Name</label>
            <input
              value={farmer.stallName}
              onChange={(e) => updateField("stallName", e.target.value)}
              className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-sage-300 block mb-1">About Your Stall</label>
            <textarea
              value={farmer.about}
              onChange={(e) => updateField("about", e.target.value)}
              className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-sage-300 block mb-2 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-emerald-400" /> Markets You Sell At
            </label>
            <div className="flex flex-wrap gap-2">
              {allMarkets.map((m) => {
                const active = farmer.markets.some((fm) => (fm._id || fm) === m._id);
                return (
                  <button
                    key={m._id}
                    onClick={() => toggleMarket(m._id)}
                    type="button"
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition ${
                      active
                        ? "bg-gradient-btn text-white shadow-3d-card"
                        : "bg-forest-900/60 text-sage-300 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-sage-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-mint-300" /> Pickup Windows
              </label>
              <button onClick={addWindow} type="button" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                <Plus className="w-3.5 h-3.5" /> Add Window
              </button>
            </div>
            <div className="space-y-2">
              {farmer.pickupWindows.map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={w.day}
                    onChange={(e) => updateWindow(i, "day", e.target.value)}
                    className="rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d} className="bg-brand-dark">{d}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={w.startTime}
                    onChange={(e) => updateWindow(i, "startTime", e.target.value)}
                    className="rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="time"
                    value={w.endTime}
                    onChange={(e) => updateWindow(i, "endTime", e.target.value)}
                    className="rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <button onClick={() => removeWindow(i)} type="button" className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}