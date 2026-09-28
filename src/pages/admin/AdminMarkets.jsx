import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Store, Clock, MapPin } from "lucide-react";
import api from "../../api/axios.js";
import { EmptyState, ErrorState } from "../../components/StateViews.jsx";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const emptyForm = { name: "", address: "", operatingDays: [], openTime: "08:00", closeTime: "13:00", latitude: "", longitude: "", description: "" };

export default function AdminMarkets() {
  const [markets, setMarkets] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    api.get("/markets?limit=100").then((res) => setMarkets(res.data.markets)).catch(() => setError("Could not load markets."));
  }
  useEffect(load, []);

  function openNew() { setForm(emptyForm); setEditing("new"); }
  function openEdit(m) {
    setForm({ name: m.name, address: m.address, operatingDays: m.operatingDays, openTime: m.openTime, closeTime: m.closeTime, latitude: m.latitude, longitude: m.longitude, description: m.description });
    setEditing(m._id);
  }
  function toggleDay(d) {
    setForm((f) => ({ ...f, operatingDays: f.operatingDays.includes(d) ? f.operatingDays.filter((x) => x !== d) : [...f.operatingDays, d] }));
  }

  async function save() {
    try {
      if (editing === "new") await api.post("/markets", form);
      else await api.put(`/markets/${editing}`, form);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not save market.");
    }
  }

  async function remove(id) {
    if (!confirm("Deactivate this market?")) return;
    await api.delete(`/markets/${id}`);
    load();
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Manage Markets
            </h1>
            <p className="text-xs sm:text-sm text-sage-300 mt-1">Configure market locations and schedules.</p>
          </div>
          <button
            onClick={openNew}
            className="py-2.5 px-5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card hover:scale-105 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Market
          </button>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}

        {!error && markets === null && (
          <div className="py-12 text-center text-sage-300 text-sm animate-pulse">Loading markets...</div>
        )}

        {!error && markets && markets.length === 0 && (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center">
            <EmptyState title="No markets yet" message="Add a market location to get started." icon={Store} />
          </div>
        )}

        {!error && markets && markets.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {markets.map((m) => (
              <div
                key={m._id}
                className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex flex-col justify-between hover:border-emerald-500/30 transition duration-300"
              >
                <div>
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-400" /> {m.name}
                  </h3>
                  <p className="text-xs text-sage-300 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-mint-300" /> {m.address}
                  </p>
                  <p className="text-xs text-emerald-400 font-medium mt-3 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {m.operatingDays.join(", ")} · {m.openTime} - {m.closeTime}
                  </p>
                </div>

                <div className="flex gap-3 border-t border-white/10 pt-3 mt-4">
                  <button onClick={() => openEdit(m)} className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => remove(m._id)} className="text-xs font-semibold text-red-400 hover:underline flex items-center gap-1 ml-auto">
                    <Trash2 className="w-3 h-3" /> Deactivate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit/Add Modal */}
        {editing && (
          <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-card border border-white/20 rounded-3xl max-w-md w-full p-6 shadow-3d-card max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-xl text-white">
                  {editing === "new" ? "Add Market" : "Edit Market"}
                </h3>
                <button onClick={() => setEditing(null)} className="p-1 text-sage-300 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <input placeholder="Market name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500" />
                <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" step="any" placeholder="Latitude" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} className="rounded-xl bg-forest-900/60 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  <input type="number" step="any" placeholder="Longitude" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} className="rounded-xl bg-forest-900/60 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="time" value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })} className="rounded-xl bg-forest-900/60 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                  <input type="time" value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })} className="rounded-xl bg-forest-900/60 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                        form.operatingDays.includes(d) ? "bg-gradient-btn text-white shadow-3d-card" : "bg-forest-900/60 border border-white/10 text-sage-300"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500" rows={2} />
              </div>

              <button onClick={save} className="w-full mt-6 py-3 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card">
                Save Market
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}