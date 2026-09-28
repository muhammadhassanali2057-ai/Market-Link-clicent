import React, { useEffect, useState } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import api from "../../api/axios.js";

export default function AdminCategories() {
  const [categories, setCategories] = useState(null);
  const [newName, setNewName] = useState("");

  function load() {
    api.get("/categories").then((res) => setCategories(res.data.categories)).catch(() => setCategories([]));
  }
  useEffect(load, []);

  async function add() {
    if (!newName.trim()) return;
    try {
      await api.post("/categories", { name: newName.trim() });
      setNewName("");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not add category.");
    }
  }

  async function remove(id) {
    if (!confirm("Delete this category? Products using it will keep their reference.")) return;
    await api.delete(`/categories/${id}`);
    load();
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
          Manage Categories
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 mb-8">
          Add or remove marketplace product categories.
        </p>

        {/* Input Bar */}
        <div className="flex gap-3 mb-8 p-2 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name..."
            className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-sage-300/50 focus:outline-none"
          />
          <button
            onClick={add}
            className="px-5 py-2.5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {categories === null && (
          <p className="text-sage-300 text-sm animate-pulse text-center py-10">Loading categories...</p>
        )}

        {categories && (
          <div className="space-y-3">
            {categories.map((c) => (
              <div
                key={c._id}
                className="p-4 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex items-center justify-between hover:border-emerald-500/30 transition duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-white text-sm">{c.name}</span>
                </div>
                <button
                  onClick={() => remove(c._id)}
                  className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}