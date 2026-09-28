import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Package,
} from "lucide-react";

import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import {
  EmptyState,
  ErrorState,
} from "../../components/StateViews.jsx";

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
  // LOAD MARKETS
  // ==========================================

  async function loadMarkets() {
    try {
      const res = await api.get("/markets");

      console.log("Markets API:", res.data);

      setMarkets(res.data.markets || []);
    } catch (err) {
      console.error("Markets loading error:", err);

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
  // FORM CHANGE
  // ==========================================

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // ==========================================
  // ADD PRODUCT
  // ==========================================

  function openNew() {
    setEditing("new");
    setForm({ ...emptyForm });
  }

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  function openEdit(product) {
    setEditing(product._id);

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
  }

  // ==========================================
  // CLOSE FORM
  // ==========================================

  function closeForm() {
    setEditing(null);
    setForm({ ...emptyForm });
  }

  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  async function handleUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("image", file);

      const res = await api.post(
        "/uploads/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl =
        res.data.url ||
        res.data.imageUrl ||
        res.data.secure_url ||
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
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.price ||
      !form.unit ||
      !form.category ||
      !form.market
    ) {
      alert(
        "Name, price, unit, category and market are required."
      );

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

      closeForm();

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

  async function removeProduct(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
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
  // LOADING
  // ==========================================

  if (products === null) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-gray-500">
          Loading products...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-6">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your marketplace products.
          </p>
        </div>

        <button
          type="button"
          onClick={openNew}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            py-3
            rounded-xl
            bg-emerald-600
            text-white
            font-semibold
            hover:bg-emerald-700
            transition
          "
        >
          <Plus size={20} />

          Add Product
        </button>
      </div>

      {/* ====================================== */}
      {/* FORM */}
      {/* ====================================== */}

      {editing !== null && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

          {/* FORM HEADER */}

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Package
                  size={20}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editing === "new"
                    ? "Add New Product"
                    : "Edit Product"}
                </h2>

                <p className="text-sm text-gray-500">
                  Add product information below.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={closeForm}
              className="
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                text-gray-500
                hover:bg-gray-100
                hover:text-gray-800
              "
            >
              <X size={20} />
            </button>

          </div>

          {/* FORM */}

          <form
            onSubmit={save}
            className="space-y-5"
          >

            {/* NAME + PRICE */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Fresh Tomatoes"
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-300
                    rounded-xl
                    outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                    focus:border-emerald-500
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price *
                </label>

                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 250"
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-300
                    rounded-xl
                    outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                    focus:border-emerald-500
                  "
                />
              </div>

            </div>

            {/* UNIT + QUANTITY */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit *
                </label>

                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-300
                    rounded-xl
                    bg-white
                    outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                  "
                >
                  <option value="kg">
                    Kilogram (kg)
                  </option>

                  <option value="g">
                    Gram (g)
                  </option>

                  <option value="piece">
                    Piece
                  </option>

                  <option value="dozen">
                    Dozen
                  </option>

                  <option value="liter">
                    Liter
                  </option>

                  <option value="pack">
                    Pack
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity Available
                </label>

                <input
                  name="quantityAvailable"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.quantityAvailable}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-300
                    rounded-xl
                    outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                  "
                />
              </div>

            </div>

            {/* CATEGORY + MARKET */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* CATEGORY */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-300
                    rounded-xl
                    bg-white
                    outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                  "
                >

                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}

                </select>

                {categories.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    No categories available.
                  </p>
                )}
              </div>

              {/* MARKET */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Market *
                </label>

                <select
                  name="market"
                  value={form.market}
                  onChange={handleChange}
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-300
                    rounded-xl
                    bg-white
                    outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                  "
                >

                  <option value="">
                    Select market
                  </option>

                  {markets.map((market) => (
                    <option
                      key={market._id}
                      value={market._id}
                    >
                      {market.name}
                    </option>
                  ))}

                </select>

                {markets.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    No markets available.
                  </p>
                )}

              </div>

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your product..."
                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-gray-300
                  rounded-xl
                  outline-none
                  resize-none
                  focus:ring-2
                  focus:ring-emerald-500
                  focus:border-emerald-500
                "
              />

            </div>

            {/* IMAGE */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image
              </label>

              <div className="flex flex-col sm:flex-row gap-4">

                <label
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-3
                    border
                    border-gray-300
                    rounded-xl
                    cursor-pointer
                    hover:bg-gray-50
                    transition
                  "
                >

                  <Upload size={19} />

                  {uploading
                    ? "Uploading..."
                    : "Upload Image"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />

                </label>

                {form.imageUrl && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200">

                    <img
                      src={form.imageUrl}
                      alt={form.name || "Product"}
                      className="w-full h-full object-cover"
                    />

                  </div>
                )}

              </div>

            </div>

            {/* WEEKLY TEMPLATE */}

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                name="isWeeklyTemplate"
                checked={form.isWeeklyTemplate}
                onChange={handleChange}
                className="w-4 h-4 accent-emerald-600"
              />

              <span className="text-sm text-gray-700">
                Use as weekly product template
              </span>

            </label>

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-3 pt-3">

              <button
                type="submit"
                disabled={saving || uploading}
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-emerald-600
                  text-white
                  font-semibold
                  hover:bg-emerald-700
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  transition
                "
              >
                {saving
                  ? "Saving..."
                  : editing === "new"
                  ? "Add Product"
                  : "Update Product"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="
                  px-6
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  text-gray-700
                  font-semibold
                  hover:bg-gray-50
                  transition
                "
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ====================================== */}
      {/* PRODUCTS */}
      {/* ====================================== */}

      {products.length === 0 ? (

        <EmptyState
          title="No products yet"
          message="Add your first product to start selling."
        />

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {products.map((product) => (

            <div
              key={product._id}
              className="
                bg-white
                rounded-2xl
                border
                border-gray-200
                overflow-hidden
                shadow-sm
                hover:shadow-md
                transition
              "
            >

              {/* IMAGE */}

              <div className="h-48 bg-gray-100">

                {product.imageUrl ? (

                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center">

                    <Package
                      size={45}
                      className="text-gray-400"
                    />

                  </div>

                )}

              </div>

              {/* CONTENT */}

              <div className="p-5">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <h3 className="font-bold text-lg text-gray-900">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {product.category?.name ||
                        "Uncategorized"}
                    </p>

                  </div>

                  {product.status && (
                    <StatusBadge
                      status={product.status}
                    />
                  )}

                </div>

                <div className="mt-4">

                  <span className="text-xl font-bold text-emerald-600">
                    Rs. {product.price}
                  </span>

                  <span className="text-sm text-gray-500 ml-1">
                    / {product.unit}
                  </span>

                </div>

                {product.quantityAvailable !==
                  undefined && (

                  <p className="text-sm text-gray-600 mt-2">
                    Available:{" "}
                    {product.quantityAvailable}{" "}
                    {product.unit}
                  </p>

                )}

                {product.market?.name && (

                  <p className="text-sm text-gray-600 mt-1">
                    Market: {product.market.name}
                  </p>

                )}

                {/* ACTIONS */}

                <div className="flex gap-2 mt-5">

                  <button
                    type="button"
                    onClick={() =>
                      openEdit(product)
                    }
                    className="
                      flex-1
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-xl
                      border
                      border-gray-300
                      text-gray-700
                      font-medium
                      hover:bg-gray-50
                    "
                  >

                    <Pencil size={17} />

                    Edit

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeProduct(product._id)
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      px-4
                      py-2.5
                      rounded-xl
                      border
                      border-red-200
                      text-red-600
                      hover:bg-red-50
                    "
                  >

                    <Trash2 size={17} />

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}
