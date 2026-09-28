import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, ArrowRight, Store } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { EmptyState } from "../components/StateViews.jsx";
import { getCategoryImage } from "../utils/imageAssets.js";

export default function Cart() {
  const cart = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="relative min-h-screen bg-brand-dark py-16 px-4 text-white overflow-hidden flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-xl w-full text-center space-y-6 p-8 rounded-3xl bg-gradient-card backdrop-blur-2xl border border-white/10 shadow-3d-card">
          <EmptyState
            title="Your cart is empty"
            message="Browse fresh produce directly from local farmers and reserve your pickup!"
            icon={ShoppingCart}
          />
          <Link
            to="/products"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-btn text-white font-bold text-sm shadow-3d-card hover:shadow-3d-card-hover hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-10 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-sage-300 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Title & Farmer Info Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-white/10">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Your Cart
            </h1>
            <p className="flex items-center gap-2 text-xs sm:text-sm text-sage-300 mt-1">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>
                Reserving items from stall: <strong className="text-emerald-300 font-semibold">{cart.farmerName}</strong>
              </span>
            </p>
          </div>
          <span className="text-xs text-sage-300/80 bg-forest-900/60 border border-white/10 px-3 py-1.5 rounded-full self-start sm:self-auto">
            {cart.items.length} {cart.items.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card hover:border-emerald-500/30 transition duration-300"
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-xl bg-forest-900/80 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={item.imageUrl || getCategoryImage()}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getCategoryImage();
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-base truncate">{item.name}</p>
                  <p className="text-xs text-sage-300 mt-0.5">
                    Rs. {item.price} <span className="text-sage-300/60">/ {item.unit}</span>
                  </p>
                </div>
              </div>

              {/* Quantity Selector, Subtotal & Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                {/* Quantity Controls */}
                <div className="inline-flex items-center rounded-xl bg-forest-900/80 border border-white/10 p-1">
                  <button
                    onClick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1.5 text-sage-300 hover:text-white transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-xs text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1.5 text-sage-300 hover:text-white transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <p className="w-24 text-right font-display font-bold text-emerald-400 text-lg">
                  Rs. {item.price * item.quantity}
                </p>

                {/* Remove Button */}
                <button
                  onClick={() => cart.removeItem(item.productId)}
                  className="p-2 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary Card */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-card backdrop-blur-2xl border border-white/10 shadow-3d-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-sage-300 uppercase tracking-wider font-semibold">
              Total Order Amount
            </span>
            <p className="text-xs text-emerald-300/80 mt-0.5">Payment occurs directly at market pickup</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-emerald-400">Rs.</span>
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-mint-300 to-lime-300">
              {cart.total}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/products"
            className="w-full sm:w-auto text-center py-3.5 px-6 rounded-xl border border-white/10 bg-forest-900/60 text-white font-bold text-sm hover:bg-forest-800 transition duration-300"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-btn text-white font-bold text-sm shadow-3d-card hover:shadow-3d-card-hover hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Proceed to Pre-Order Slot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}