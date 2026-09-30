import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Eye, ShoppingBag } from "lucide-react";
import StarRating from "./StarRating.jsx";
import StatusBadge from "./StatusBadge.jsx";
import { getCategoryImage } from "../utils/imageAssets.js";
import api from "../api/axios.js";

export default function ProductCard({
  product,
  isFavorited,
  onToggleFavorite,
  onAddToCart,
}) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafId = useRef(null);

  // Build the correct image URL
  const getProductImageUrl = (imageUrl) => {
    // No uploaded image → category fallback
    if (!imageUrl) {
      return getCategoryImage(product?.category?.name);
    }

    // Cloudinary or any other complete URL
    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    // Backend local upload such as:
    // /uploads/12345-image.jpg
    const baseURL = api.defaults.baseURL || "";

    try {
      return new URL(imageUrl, baseURL).toString();
    } catch {
      return imageUrl;
    }
  };

  const imageSrc = getProductImageUrl(product?.imageUrl);

  // Smooth 3D tilt without triggering heavy React re-renders
  const handleMouseMove = (e) => {
    if (!cardRef.current || window.matchMedia("(hover: none)").matches) {
      return;
    }

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glareRef.current) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;

        glareRef.current.style.background = `radial-gradient(
          circle at ${glareX}% ${glareY}%,
          rgba(0,255,157,0.25) 0%,
          transparent 60%
        )`;

        glareRef.current.style.opacity = "1";
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }

    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
        transformStyle: "preserve-3d",
      }}
      className="group relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-gradient-card backdrop-blur-xl shadow-3d-card hover:shadow-3d-card-hover hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Interactive Light Glare Overlay */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl opacity-0"
      />

      {/* Top Banner Image Container */}
      <div className="relative">
        <Link
          to={`/products/${product?._id}`}
          className="block relative h-48 overflow-hidden bg-forest-900/40"
          style={{ transform: "translateZ(30px)" }}
        >
          <img
            src={imageSrc}
            alt={product?.name || "Product"}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.onerror = null;

              // Use category-specific fallback instead of
              // the same generic image for every product
              e.currentTarget.src = getCategoryImage(
                product?.category?.name
              );
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Status Badge */}
          {product?.status && (
            <div className="absolute top-3 left-3 z-20">
              <StatusBadge status={product.status} />
            </div>
          )}

          {/* Quick View Floating Pill */}
          <span className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-forest-900/80 border border-emerald-500/30 backdrop-blur-md px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </span>
        </Link>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            aria-label="Toggle favorite"
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-forest-900/60 backdrop-blur-md border border-white/10 text-white hover:bg-forest-800/80 transition-all active:scale-90 shadow-md"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited
                  ? "fill-red-500 text-red-500"
                  : "text-white/80 group-hover:text-white"
              }`}
            />
          </button>
        )}
      </div>

      {/* Card Details Body */}
      <div
        className="p-4 space-y-3 flex-1 flex flex-col justify-between"
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="space-y-1">
          <Link
            to={`/products/${product?._id}`}
            className="font-display font-bold text-lg text-white hover:text-emerald-400 transition-colors line-clamp-1 block"
          >
            {product?.name || "Unnamed Product"}
          </Link>

          <p className="text-xs text-sage-300/80 line-clamp-1">
            {product?.farmer?.stallName || "Local Stall"}

            {product?.market?.name && (
              <>
                {" · "}
                <span className="text-emerald-400/90">
                  {product.market.name}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Price, Rating & Add to Cart */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-emerald-400 font-medium">
                Rs.
              </span>

              <span className="font-display font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-mint-300">
                {product?.price ?? 0}
              </span>

              {product?.unit && (
                <span className="text-xs text-sage-300">
                  /{product.unit}
                </span>
              )}
            </div>

            <div className="bg-forest-900/60 border border-white/5 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <StarRating
                value={product?.ratingAverage || 0}
                count={product?.ratingCount || 0}
                size="w-3.5 h-3.5"
              />
            </div>
          </div>

          {/* Quick Add To Cart CTA Button */}
          {onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-medium text-xs transition-all active:scale-95 shadow-sm hover:shadow-glow-emerald"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          )}
        </div>

        {/* Location Info */}
        {product?.market?.address && (
          <p className="flex items-center gap-1.5 text-[11px] text-sage-300/70 pt-2 border-t border-white/10">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              {product.market.address}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}