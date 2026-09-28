import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload, Package } from "lucide-react";
import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import { EmptyState, ErrorState } from "../../components/StateViews.jsx";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  unit: "kg",
  quantityAvailable: "",
  category: "",
  market: "",
  imageUrl: "",
  isWeeklyTemplate: false,
};

export default function FarmerProducts() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [markets, setMarkets] = useState([]);

  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  async function loadProducts() {
    try {
      setError(null);

      const res = await api.get("/products/mine");

      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Products loading error:", err);

      setError("Could not load your products.");
      setProducts([]);
    }
  }

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  async function loadCategories() {
    try {
      const res = await api.get("/categories");

      console.log("Categories API:", res.data);

      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Categories loading error:", err);

      setCategories([]);
    }
  }

  // ==========================================
  // LOAD FARMER MARKETS
  // ==========================================

  async function loadMarkets() {
    try {
      /*
       * IMPORTANT:
       * We use /farmers/me so the dropdown only shows
       * markets assigned to the logged-in farmer.
       *
       * This keeps the backend authorization rule:
       * "You can only list products at a market you sell at."
       */

      const res = await api.get("/farmers/me");

      console.log("Farmer profile API:", res.data);

      const farmer = res.data?.farmer;

      const farmerMarkets = farmer?.markets || [];

      setMarkets(farmerMarkets);

      /*
       * If farmer markets are populated objects:
       * [{ _id, name }]
       *
       * If they are only IDs:
       * ["marketId"]
       *
       * the select below handles the populated-object case.
       */

    } catch (err) {
      console.error("Farmer markets loading error:", err);

      setMarkets([]);
    }
  }

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadMarkets();
  }, []);

  // ==========================================
  // OPEN NEW PRODUCT
  // ==========================================

  function openNew() {
    setForm({ ...emptyForm });
    setEditing("new");
  }

  // ==========================================
  // OPEN EDIT PRODUCT
  // ==========================================

  function openEdit(product) {
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      unit: product.unit || "kg",
      quantityAvailable: product.quantityAvailable ?? "",

      category:
        product.category?._id ||
        product.category ||
        "",

      market:
        product.market?._id ||
        product.market ||
        "",

      imageUrl: product.imageUrl || "",

      isWeeklyTemplate:
        product.isWeeklyTemplate || false,
    });

    setEditing(product._id);
  }

  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const fd = new FormData();

    fd.append("image", file);

    try {
      const res = await api.post(
        "/uploads/image",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl =
        res.data?.url ||
        res.data?.imageUrl ||
        res.data?.secure_url ||
        "";

      setForm((prev) => ({
        ...prev,
        imageUrl,
      }));
    } catch (err) {
      console.error("Image upload error:", err);

      alert(
        err.response?.data?.message ||
          "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  // ==========================================
  // SAVE PRODUCT
  // ==========================================

  async function save(e) {
    e?.preventDefault?.();

    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!form.price) {
      alert("Price is required.");
      return;
    }

    if (!form.category) {
      alert("Please select a category.");
      return;
    }

    if (!form.market) {
      alert("Please select a market.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),

        description: form.description.trim(),

        price: Number(form.price),

        unit: form.unit,

        quantityAvailable:
          form.quantityAvailable === ""
            ? 0
            : Number(form.quantityAvailable),

        category: form.category,

        market: form.market,

        imageUrl: form.imageUrl,

        isWeeklyTemplate:
          Boolean(form.isWeeklyTemplate),
      };

      console.log("Saving product:", payload);

      if (editing === "new") {
        await api.post("/products", payload);
      } else {
        await api.put(
          `/products/${editing}`,
          payload
        );
      }

      alert(
        editing === "new"
          ? "Product added successfully!"
          : "Product updated successfully!"
      );

      setEditing(null);
      setForm({ ...emptyForm });

      await loadProducts();
    } catch (err) {
      console.error("Product save error:", err);

      alert(
        err.response?.data?.message ||
          "Could not save product."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  async function remove(id) {
    const confirmed = window.confirm(
      "Delete this product?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`);

      alert("Product deleted successfully.");

      await loadProducts();
    } catch (err) {
      console.error("Delete product error:", err);

      alert(
        err.response?.data?.message ||
          "Could not delete product."
      );
    }
  }

  // ==========================================
  // TOGGLE SOLD OUT
  // ==========================================

  async function toggleSoldOut(product) {
    try {
      const status =
        product.status === "SOLD_OUT"
          ? "AVAILABLE"
          : "SOLD_OUT";

      await api.put(
        `/products/${product._id}`,
        { status }
      );

      await loadProducts();
    } catch (err) {
      console.error(
        "Product status update error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Could not update product status."
      );
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (products === null) {
    return (
      <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-sage-300 text-sm animate-pulse">
            Loading products...
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">

      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="absolute bottom-10 left-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">

          <div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              My Products
            </h1>

            <p className="text-xs sm:text-sm text-sage-300 mt-1">
              Manage product inventory and pricing.
            </p>

          </div>

          <button
            onClick={openNew}
            className="py-2.5 px-5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-3d-card hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />

            Add Product
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <ErrorState
            message={error}
            onRetry={loadProducts}
          />
        )}

        {/* EMPTY */}

        {!error &&
          products.length === 0 && (
            <div className="p-8 rounded-3xl bg-gradient-card border border-white/10 text-center">

              <EmptyState
                title="No products yet"
                message="Add your first product to start selling."
                icon={Package}
              />

            </div>
          )}

        {/* PRODUCTS */}

        {!error &&
          products.length > 0 && (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {products.map((p) => (

                <div
                  key={p._id}
                  className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card flex flex-col justify-between hover:border-emerald-500/30 transition duration-300"
                >

                  <div>

                    <div className="flex items-start justify-between gap-2 mb-2">

                      <div>

                        <h3 className="font-bold text-white text-base">
                          {p.name}
                        </h3>

                        <p className="text-xs text-sage-300">
                          {p.category?.name ||
                            "Uncategorized"}{" "}
                          ·{" "}
                          {p.market?.name ||
                            "No market"}
                        </p>

                      </div>

                      {p.status && (
                        <StatusBadge
                          status={p.status}
                        />
                      )}

                    </div>

                    <p className="text-emerald-400 font-semibold text-sm mt-3">

                      Rs. {p.price} / {p.unit}

                      <span className="text-sage-300 text-xs font-normal">
                        {" "}
                        ({p.quantityAvailable} in stock)
                      </span>

                    </p>

                  </div>

                  <div className="flex items-center gap-3 border-t border-white/10 pt-3 mt-4">

                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Pencil className="w-3.5 h-3.5" />

                      Edit
                    </button>

                    <button
                      onClick={() =>
                        toggleSoldOut(p)
                      }
                      className="text-xs font-semibold text-amber-400 hover:underline"
                    >
                      {p.status === "SOLD_OUT"
                        ? "Mark Available"
                        : "Mark Sold Out"}
                    </button>

                    <button
                      onClick={() => remove(p._id)}
                      className="text-xs font-semibold text-red-400 hover:underline flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />

                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        {/* MODAL */}

        {editing && (

          <div className="fixed inset-0 z-50 flex items-center justify-center pt-20 px-4 bg-brand-dark/85 backdrop-blur-md">

            <div className="relative w-full max-w-md bg-[#0c1611] border border-emerald-500/20 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-5 flex flex-col">

              {/* HEADER */}

              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 shrink-0">

                <h3 className="font-display font-bold text-base text-white">
                  {editing === "new"
                    ? "Add Product"
                    : "Edit Product"}
                </h3>

                <button
                  onClick={() => {
                    setEditing(null);
                    setForm({ ...emptyForm });
                  }}
                  className="p-1 rounded-lg text-sage-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

              </div>

              {/* FORM BODY */}

              <div className="space-y-2.5 text-xs">

                <input
                  placeholder="Product name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500"
                />

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-3 py-1.5 text-xs text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500 resize-none"
                  rows={2}
                />

                <div className="grid grid-cols-2 gap-2">

                  <input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value,
                      })
                    }
                    className="rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500"
                  />

                  <select
                    value={form.unit}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        unit: e.target.value,
                      })
                    }
                    className="rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option
                      value="kg"
                      className="bg-[#0c1611]"
                    >
                      Kilogram (kg)
                    </option>

                    <option
                      value="g"
                      className="bg-[#0c1611]"
                    >
                      Gram (g)
                    </option>

                    <option
                      value="piece"
                      className="bg-[#0c1611]"
                    >
                      Piece
                    </option>

                    <option
                      value="dozen"
                      className="bg-[#0c1611]"
                    >
                      Dozen
                    </option>

                    <option
                      value="liter"
                      className="bg-[#0c1611]"
                    >
                      Liter
                    </option>

                    <option
                      value="pack"
                      className="bg-[#0c1611]"
                    >
                      Pack
                    </option>
                  </select>

                </div>

                <input
                  type="number"
                  min="0"
                  placeholder="Quantity available"
                  value={form.quantityAvailable}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantityAvailable:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white placeholder-sage-300/50 focus:outline-none focus:border-emerald-500"
                />

                {/* CATEGORY */}

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >

                  <option
                    value=""
                    className="bg-[#0c1611]"
                  >
                    Select category
                  </option>

                  {categories.map((c) => (

                    <option
                      key={c._id}
                      value={c._id}
                      className="bg-[#0c1611]"
                    >
                      {c.name}
                    </option>

                  ))}

                </select>

                {/* MARKET */}

                <select
                  value={form.market}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      market: e.target.value,
                    })
                  }
                  className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >

                  <option
                    value=""
                    className="bg-[#0c1611]"
                  >
                    Select market
                  </option>

                  {markets.map((m) => (

                    <option
                      key={m._id}
                      value={m._id}
                      className="bg-[#0c1611]"
                    >
                      {m.name}
                    </option>

                  ))}

                </select>

                {markets.length === 0 && (
                  <p className="text-[10px] text-amber-300">
                    No markets are assigned to your farmer account.
                  </p>
                )}

                {/* IMAGE */}

                <div className="p-2.5 rounded-xl bg-forest-900/40 border border-white/10 flex items-center justify-between gap-2">

                  <div>

                    <label className="text-[11px] text-sage-300 block mb-1 flex items-center gap-1 font-medium">

                      <Upload className="w-3 h-3 text-emerald-400" />

                      Product Image

                    </label>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="text-[10px] text-sage-300 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:bg-emerald-500/20 file:text-emerald-300"
                    />

                    {uploading && (
                      <span className="text-[10px] text-sage-300/70">
                        Uploading...
                      </span>
                    )}

                  </div>

                  {form.imageUrl && (
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      className="h-10 w-10 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                  )}

                </div>

                {/* WEEKLY TEMPLATE */}

                <label className="flex items-center gap-2 text-[11px] text-sage-300 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={form.isWeeklyTemplate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isWeeklyTemplate:
                          e.target.checked,
                      })
                    }
                    className="rounded accent-emerald-500 w-3.5 h-3.5"
                  />

                  Save as recurring weekly stock template

                </label>

              </div>

              {/* FOOTER */}

              <div className="pt-2.5 mt-2.5 border-t border-white/10 shrink-0">

                <button
                  onClick={save}
                  disabled={
                    saving ||
                    uploading ||
                    !form.market
                  }
                  className="w-full py-2.5 rounded-xl bg-gradient-btn text-white text-xs font-bold shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:opacity-95 transition-all duration-300 disabled:opacity-50"
                >

                  {saving
                    ? "Saving..."
                    : editing === "new"
                    ? "Add Product"
                    : "Update Product"}

                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}
