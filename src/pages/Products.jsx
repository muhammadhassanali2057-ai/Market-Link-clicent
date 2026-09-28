import React, { useEffect, useState, useRef } from "react";
import { Search, SlidersHorizontal, RotateCcw, Filter, X, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { SkeletonGrid, EmptyState, ErrorState } from "../components/StateViews.jsx";

// Custom Dropdown Component for perfect UI styling
function CustomDropdown({ label, value, options, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-wider text-sage-300/70 block mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-sm rounded-xl bg-[#081611]/90 border border-white/10 text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 shadow-inner transition text-left cursor-pointer"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-sage-300/70 transition-transform duration-200 ${isOpen ? "rotate-180 text-emerald-400" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-[#081611] border border-white/15 shadow-2xl backdrop-blur-2xl max-h-60 overflow-y-auto py-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-150">
          <div
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className={`px-3.5 py-2.5 text-sm cursor-pointer transition flex items-center justify-between ${
              value === "" ? "bg-emerald-500/20 text-emerald-300 font-medium" : "text-sage-200 hover:bg-white/5 hover:text-white"
            }`}
          >
            {placeholder}
          </div>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3.5 py-2.5 text-sm cursor-pointer transition flex items-center justify-between ${
                value === opt.value ? "bg-emerald-500/20 text-emerald-300 font-medium" : "text-sage-200 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="truncate">{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Products() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [favIds, setFavIds] = useState(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const initialFilters = {
    search: "",
    category: "",
    market: "",
    minPrice: "",
    maxPrice: "",
    availability: "",
    sort: "newest",
    page: 1,
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        const fetchedCategories = res.data.categories || [];
        setCategories(fetchedCategories);
        const nameParam = searchParams.get("category");
        if (nameParam) {
          const match = fetchedCategories.find(
            (c) => c.name.toLowerCase() === nameParam.toLowerCase()
          );
          if (match) setFilters((f) => ({ ...f, category: match._id }));
        }
      })
      .catch(() => {});

    api
      .get("/markets?limit=50")
      .then((res) => setMarkets(res.data.markets || []))
      .catch(() => {});
  }, [searchParams]);

  useEffect(() => {
    if (user?.role === "CUSTOMER") {
      api
        .get("/favorites")
        .then((res) => {
          setFavIds(
            new Set(
              (res.data.favorites || [])
                .filter((f) => f.targetType === "PRODUCT")
                .map((f) => f.targetId)
            )
          );
        })
        .catch(() => {});
    }
  }, [user]);

  function load() {
    setError(null);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("limit", "12");

    api
      .get(`/products?${params.toString()}`)
      .then((res) => {
        setProducts(res.data.products);
        setMeta(res.data.meta);
      })
      .catch(() => setError("Could not load products."));
  }

  useEffect(() => {
    setProducts(null);
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(field, value) {
    setFilters((f) => ({ ...f, [field]: value, page: field === "page" ? value : 1 }));
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  async function toggleFavorite(product) {
    try {
      const res = await api.post("/favorites/toggle", {
        targetType: "PRODUCT",
        targetId: product._id,
      });
      setFavIds((prev) => {
        const next = new Set(prev);
        if (res.data.favorited) next.add(product._id);
        else next.delete(product._id);
        return next;
      });
    } catch {
      // Ignore favorite errors
    }
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Title & Mobile Filter Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Fresh <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-mint-300 to-lime-300">Farm Products</span>
            </h1>
            <p className="text-sage-100/80 text-sm sm:text-base mt-2">
              Explore fresh harvest available for direct pickup across local markets.
            </p>
          </div>

          <button
            onClick={() => setShowMobileFilters((v) => !v)}
            className="md:hidden self-start flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-900/80 border border-white/10 text-xs font-semibold text-emerald-300 hover:text-white transition shadow-sm"
          >
            {showMobileFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            <span>{showMobileFilters ? "Close Filters" : "Filter Catalog"}</span>
          </button>
        </div>

        <div className="grid md:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar Filter Panel */}
          <aside
            className={`p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card space-y-5 h-fit ${
              showMobileFilters ? "block" : "hidden md:block"
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="flex items-center gap-2 font-display font-semibold text-sm text-emerald-300">
                <SlidersHorizontal className="w-4 h-4" /> Filter Catalog
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-sage-300/70 hover:text-white flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search Input */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-sage-300/70">
                Search
              </label>
              <div className="relative mt-1.5">
                <Search className="w-4 h-4 absolute left-3 top-3 text-sage-300/50" />
                <input
                  value={filters.search}
                  onChange={(e) => update("search", e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-[#081611]/90 border border-white/10 text-white placeholder:text-sage-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition shadow-inner"
                />
              </div>
            </div>

            {/* Category Custom Dropdown */}
            <CustomDropdown
              label="Category"
              value={filters.category}
              placeholder="All Categories"
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
              onChange={(val) => update("category", val)}
            />

            {/* Market Custom Dropdown */}
            <CustomDropdown
              label="Market"
              value={filters.market}
              placeholder="All Markets"
              options={markets.map((m) => ({ value: m._id, label: m.name }))}
              onChange={(val) => update("market", val)}
            />

            {/* Price Range */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-sage-300/70">
                Price Range (Rs.)
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => update("minPrice", e.target.value)}
                  className="w-full text-sm rounded-xl bg-[#081611]/90 border border-white/10 text-white px-3 py-2 placeholder:text-sage-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 shadow-inner"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => update("maxPrice", e.target.value)}
                  className="w-full text-sm rounded-xl bg-[#081611]/90 border border-white/10 text-white px-3 py-2 placeholder:text-sage-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 shadow-inner"
                />
              </div>
            </div>

            {/* Availability Custom Dropdown */}
            <CustomDropdown
              label="Availability"
              value={filters.availability}
              placeholder="Any Status"
              options={[
                { value: "AVAILABLE", label: "In Stock" },
                { value: "SOLD_OUT", label: "Sold Out" },
              ]}
              onChange={(val) => update("availability", val)}
            />

            {/* Sort Order Custom Dropdown */}
            <CustomDropdown
              label="Sort By"
              value={filters.sort}
              placeholder="Newest First"
              options={[
                { value: "newest", label: "Newest First" },
                { value: "price_asc", label: "Price: Low to High" },
                { value: "price_desc", label: "Price: High to Low" },
                { value: "rating", label: "Top Rated" },
              ]}
              onChange={(val) => update("sort", val)}
            />
          </aside>

          {/* Product Grid & Pagination View */}
          <div>
            {error && <ErrorState message={error} onRetry={load} />}
            {!error && products === null && <SkeletonGrid count={9} className="lg:grid-cols-3" />}
            {!error && products && products.length === 0 && (
              <EmptyState
                title="No products found"
                message="Try resetting your filters or modifying your search."
                icon={Search}
              />
            )}
            {!error && products && products.length > 0 && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <ProductCard
                      key={p._id}
                      product={p}
                      isFavorited={favIds.has(p._id)}
                      onToggleFavorite={user?.role === "CUSTOMER" ? toggleFavorite : undefined}
                    />
                  ))}
                </div>

                {/* Glassmorphic Pagination Bar */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: meta.totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => update("page", i + 1)}
                        className={`w-9 h-9 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          filters.page === i + 1
                            ? "bg-gradient-btn text-white shadow-glow-emerald scale-105"
                            : "bg-forest-900/60 border border-white/10 text-sage-300 hover:text-white hover:border-emerald-500/40"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}