import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload, Package } from "lucide-react";
import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import { EmptyState, ErrorState } from "../../components/StateViews.jsx";

const emptyForm = { name: "", description: "", price: "", unit: "kg", quantityAvailable: "", category: "", market: "", imageUrl: "", isWeeklyTemplate: false };

export default function FarmerProducts() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function load() {
    api.get("/products/mine").then((res) => setProducts(res.data.products)).catch(() => setError("Could not load your products."));
  }
  useEffect(load, []);
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.categories)).catch(() => {});
    api.get("/farmers/me").then((res) => setMarkets(res.data.farmer.markets)).catch(() => {});
  }, []);

  function openNew() {
    setForm(emptyForm);
    setEditing("new");
  }
  function openEdit(p) {
    setForm({
      name: p.name, description: p.description, price: p.price, unit: p.unit,
      quantityAvailable: p.quantityAvailable, category: p.category?._id || p.category,
      market: p.market?._id || p.market, imageUrl: p.imageUrl, isWeeklyTemplate: p.isWeeklyTemplate,
    });
    setEditing(p._id);
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await api.post("/uploads/image", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, imageUrl: res.data.url }));
    } catch (err) {
      alert(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      if (editing === "new") {
        await api.post("/products", form);
      } else {
        await api.put(`/products/${editing}`, form);
      }
      setEditing(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  }

  async function toggleSoldOut(p) {
    const status = p.status === "SOLD_OUT" ? "AVAILABLE" : "SOLD_OUT";
    await api.put(`/products/${p._id}`, { status });
    load();
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              My Products
            </h1>
            <p className="text-xs sm:text-sm text-sage-300 mt-1">Manage product inventory and pricing.</p>
          </div>
          <button
            onClick={openNew}
            className="py-2.5 px-5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {error && <ErrorState message={error} onRetry={load} />}

        {!error && products === null && (
          <div className="py-12 text-center text-sage-300 text-sm animate-pulse">Loading products...</div>
        )}

        {!error && products && products.length === 0 && (
          <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center">
            <EmptyState title="No products yet" message="Add your first product to start selling." icon={Package} />
          </div>
        )}

        {!error && products && products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <div
                key={p._id}
                className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex flex-col justify-between hover:border-emerald-500/30 transition duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-white text-base">{p.name}</h3>
                      <p className="text-xs text-sage-300">
                        {p.category?.name} · {p.market?.name}
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-emerald-400 font-semibold text-sm mt-3">
                    Rs. {p.price} / {p.unit} <span className="text-sage-300 text-xs font-normal">({p.quantityAvailable} in stock)</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-white/10 pt-3 mt-4">
                  <button onClick={() => openEdit(p)} className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => toggleSoldOut(p)} className="text-xs font-semibold text-amber-400 hover:underline">
                    {p.status === "SOLD_OUT" ? "Mark Available" : "Mark Sold Out"}
                  </button>
                  <button onClick={() => remove(p._id)} className="text-xs font-semibold text-red-400 hover:underline flex items-center gap-1 ml-auto">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Dialog Without Scroll */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pt-20 px-4 bg-brand-dark/85 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#0c1611] border border-emerald-500/20 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-5 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 shrink-0">
                <h3 className="font-display font-bold text-base text-white">
                  {editing === "new" ? "Add Product" : "Edit Product"}
                </h3>
                <button
                  onClick={() => setEditing(null)}
                  className="p-1 rounded-lg text-sage-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body (No Scroll) */}
              <div className="space-y-2.5 text-xs">
                <input
                  placeholder="Product name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500"
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-3 py-1.5 text-xs text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500 resize-none"
                  rows={1.5}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    placeholder="Unit (kg, dozen...)"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Quantity available"
                  value={form.quantityAvailable}
                  onChange={(e) => setForm({ ...form, quantityAvailable: e.target.value })}
                  className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="" className="bg-[#0c1611]">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id} className="bg-[#0c1611]">{c.name}</option>
                  ))}
                </select>
                <select
                  value={form.market}
                  onChange={(e) => setForm({ ...form, market: e.target.value })}
                  className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="" className="bg-[#0c1611]">Select market</option>
                  {markets.map((m) => (
                    <option key={m._id} value={m._id} className="bg-[#0c1611]">{m.name}</option>
                  ))}
                </select>

                <div className="p-2.5 rounded-xl bg-forest-900/40 border border-white/10 flex items-center justify-between gap-2">
                  <div>
                    <label className="text-[11px] text-sage-300 block mb-1 flex items-center gap-1 font-medium">
                      <Upload className="w-3 h-3 text-emerald-400" /> Product Image
                    </label>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="text-[10px] text-sage-300 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:bg-emerald-500/20 file:text-emerald-300" />
                    {uploading && <span className="text-[10px] text-sage-300/70">Uploading...</span>}
                  </div>
                  {form.imageUrl && <img src={form.imageUrl} alt="preview" className="h-10 w-10 rounded-lg object-cover border border-white/10 shrink-0" />}
                </div>

                <label className="flex items-center gap-2 text-[11px] text-sage-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isWeeklyTemplate}
                    onChange={(e) => setForm({ ...form, isWeeklyTemplate: e.target.checked })}
                    className="rounded accent-emerald-500 w-3.5 h-3.5"
                  />
                  Save as recurring weekly stock template
                </label>
              </div>

              {/* Footer Button */}
              <div className="pt-2.5 mt-2.5 border-t border-white/10 shrink-0">
                <button
                  onClick={save}
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:opacity-95 transition-all duration-300 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}