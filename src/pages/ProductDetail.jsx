import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Store,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import StarRating from "../components/StarRating.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ErrorState } from "../components/StateViews.jsx";
import { getCategoryImage } from "../utils/imageAssets.js";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [favorited, setFavorited] = useState(false);
  const [confirmSwap, setConfirmSwap] = useState(false);
  const [addedMsg, setAddedMsg] = useState("");

  function load() {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setData(res.data);
        setQty(1);
      })
      .catch(() => setError("Could not load this product."));

    api
      .get(`/reviews?targetType=PRODUCT&targetId=${id}`)
      .then((res) => setReviews(res.data.reviews || []))
      .catch(() => {});
  }

  useEffect(() => {
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user?.role === "CUSTOMER") {
      api
        .get("/favorites")
        .then((res) => {
          setFavorited(
            (res.data.favorites || []).some(
              (f) => f.targetType === "PRODUCT" && f.targetId === id
            )
          );
        })
        .catch(() => {});
    }
  }, [user, id]);

  async function toggleFavorite() {
    try {
      const res = await api.post("/favorites/toggle", {
        targetType: "PRODUCT",
        targetId: id,
      });
      setFavorited(res.data.favorited);
    } catch {
      // Ignore favorite errors silently
    }
  }

  function buildCartProduct(product) {
    return {
      productId: product._id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      imageUrl: product.imageUrl,
      maxAvailable: product.quantityAvailable,
      farmerId: product.farmer._id,
      farmerName: product.farmer.stallName,
    };
  }

  function handleAddToCart() {
    if (!user) return navigate("/login");
    const product = data.product;
    try {
      cart.addItem(buildCartProduct(product), qty);
      setAddedMsg("Added to cart!");
      setTimeout(() => setAddedMsg(""), 2000);
    } catch (err) {
      if (err.message === "DIFFERENT_FARMER") setConfirmSwap(true);
    }
  }

  function confirmSwapCart() {
    cart.replaceCartWith(buildCartProduct(data.product), qty);
    setConfirmSwap(false);
    setAddedMsg("Cart updated!");
    setTimeout(() => setAddedMsg(""), 2000);
  }

  if (error)
    return (
      <div className="min-h-screen bg-brand-dark py-16 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <ErrorState message={error} onRetry={load} />
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center text-sage-300">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
          <span>Loading fresh product details...</span>
        </div>
      </div>
    );

  const { product, related } = data;
  const soldOut =
    product.status !== "AVAILABLE" || product.quantityAvailable === 0;

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Navigation Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-sage-300 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>

        {/* Product Details Section */}
        <div className="grid md:grid-cols-2 gap-10 p-6 sm:p-8 rounded-3xl bg-gradient-card backdrop-blur-2xl border border-white/10 shadow-3d-card">
          {/* Product Image */}
          <div className="relative rounded-2xl overflow-hidden bg-forest-900/50 border border-white/10 h-80 sm:h-96 md:h-full flex items-center justify-center group">
            <img
              src={product.imageUrl || getCategoryImage(product.category?.name)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getCategoryImage();
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent opacity-60" />
            <div className="absolute top-4 left-4 z-10">
              <StatusBadge status={product.status} />
            </div>
          </div>

          {/* Details Content */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  {product.name}
                </h1>
                {user?.role === "CUSTOMER" && (
                  <button
                    onClick={toggleFavorite}
                    className="p-2.5 rounded-full bg-forest-900/60 border border-white/10 hover:bg-forest-800 transition active:scale-90 shrink-0"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        favorited
                          ? "fill-red-500 text-red-500"
                          : "text-sage-300"
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Farmer & Market Info */}
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm text-sage-100/80">
                {product.farmer && (
                  <p className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Sold by{" "}
                      <Link
                        to={`/farmers/${product.farmer._id}`}
                        className="text-emerald-300 font-semibold hover:underline"
                      >
                        {product.farmer.stallName}
                      </Link>
                    </span>
                  </p>
                )}
                {product.market?.name && (
                  <p className="flex items-center gap-2 text-sage-300/80">
                    <MapPin className="w-4 h-4 text-mint-300 shrink-0" />
                    <span>{product.market.name}</span>
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="mt-4 flex items-center gap-2">
                <StarRating
                  value={product.ratingAverage}
                  count={product.ratingCount}
                />
              </div>

              {/* Pricing */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-emerald-400">
                  Rs.
                </span>
                <span className="font-display font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-mint-300 to-lime-300">
                  {product.price}
                </span>
                <span className="text-sm text-sage-300">/ {product.unit}</span>
              </div>

              <p className="text-xs text-emerald-300/80 mt-1 font-medium">
                {product.quantityAvailable} {product.unit} in stock
              </p>

              {/* Description */}
              {product.description && (
                <p className="mt-5 text-sm sm:text-base text-sage-100/90 leading-relaxed border-t border-white/10 pt-4">
                  {product.description}
                </p>
              )}
            </div>

            {/* Actions */}
            {user?.role !== "FARMER" && user?.role !== "ADMIN" && (
              <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="inline-flex items-center rounded-xl bg-forest-900/80 border border-white/10 p-1">
                    <button
                      disabled={soldOut}
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="p-2 text-sage-300 hover:text-white disabled:opacity-30 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-white">
                      {qty}
                    </span>
                    <button
                      disabled={soldOut}
                      onClick={() =>
                        setQty((q) =>
                          Math.min(product.quantityAvailable, q + 1)
                        )
                      }
                      className="p-2 text-sage-300 hover:text-white disabled:opacity-30 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    disabled={soldOut}
                    onClick={handleAddToCart}
                    className="flex-1 min-w-[200px] py-3.5 px-6 rounded-xl bg-gradient-btn text-white font-bold text-sm shadow-3d-card hover:shadow-3d-card-hover hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{soldOut ? "Out of Stock" : "Add to Cart"}</span>
                  </button>
                </div>

                {addedMsg && (
                  <p className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" /> {addedMsg}
                  </p>
                )}

                {/* Confirm Farmer Swap Warning Box */}
                {confirmSwap && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md text-xs sm:text-sm space-y-3">
                    <p className="text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                      <span>
                        Your cart contains items from{" "}
                        <strong>{cart.farmerName}</strong>. Orders are limited to
                        one farmer at a time. Replace cart?
                      </span>
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={confirmSwapCart}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold transition"
                      >
                        Replace Cart
                      </button>
                      <button
                        onClick={() => setConfirmSwap(false)}
                        className="px-4 py-2 rounded-xl bg-forest-900/80 border border-white/10 text-white hover:bg-forest-800 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-14">
          <h2 className="font-display font-bold text-2xl text-white mb-6">
            Customer Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="p-6 rounded-2xl bg-gradient-card border border-white/10 text-sage-300 text-sm">
              No reviews for this product yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white text-sm">
                      {r.customer?.name || "Verified Customer"}
                    </span>
                    <div className="flex items-center gap-3">
                      {r.createdAt && (
                        <span className="text-[11px] text-sage-300/60 hidden sm:inline">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      )}
                      <StarRating value={r.rating} size="w-3.5 h-3.5" />
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-xs sm:text-sm text-sage-100/80 mt-2 leading-relaxed">
                      {r.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products Grid */}
        {related?.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display font-bold text-2xl text-white mb-6">
              You Might Also Like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}