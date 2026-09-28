import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Search,
  Calendar,
  Users,
  ShieldCheck,
  Star,
  Sparkles,
  Heart,
  ArrowRight,
} from "lucide-react";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Hero from "../components/Hero.jsx";
import { SkeletonGrid } from "../components/StateViews.jsx";
import { CATEGORY_IMAGES, MARKET_STALL_IMAGE } from "../utils/imageAssets.js";

const HOW_IT_WORKS = [
  { icon: MapPin, title: "Discover Markets", text: "Browse farmers markets near you by location and day." },
  { icon: Search, title: "Browse & Filter", text: "Search fresh produce by category, price, and farmer." },
  { icon: Calendar, title: "Reserve Pickup", text: "Pick a date and time slot that works for you." },
  { icon: Users, title: "Meet Your Farmer", text: "Pick up in person and pay at the stall — no middlemen." },
];

const CATEGORY_SHOWCASE = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Baked Goods",
  "Herbs",
  "Organic Produce",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Landing() {
  const [products, setProducts] = useState(null);
  const [farmers, setFarmers] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api
      .get("/products?limit=4&sort=rating")
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]));

    api
      .get("/farmers?limit=3")
      .then((res) => setFarmers(res.data.farmers))
      .catch(() => setFarmers([]));
  }, []);

  useEffect(() => {
    if (!farmers?.length) return;
    Promise.all(
      farmers
        .slice(0, 3)
        .map((f) =>
          api
            .get(`/reviews?targetType=FARMER&targetId=${f._id}`)
            .then((r) => r.data.reviews)
        )
    )
      .then((all) =>
        setReviews(all.flat().filter((r) => r?.comment).slice(0, 3))
      )
      .catch(() => {});
  }, [farmers]);

  return (
    <div className="bg-brand-dark min-h-screen text-white overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Why MarketLink (Glassmorphic Feature Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Know before you go",
              text: "See real stock and prices before you leave home — no more wasted trips for sold-out items.",
            },
            {
              icon: Heart,
              title: "Direct from the source",
              text: "Every purchase goes straight to the farmer who grew it, with no delivery fees or middlemen.",
            },
            {
              icon: Sparkles,
              title: "Built for the community",
              text: "Farmers plan their harvest with confidence; customers get first pick of what's fresh.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="p-8 rounded-3xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card hover:shadow-3d-card-hover hover:border-emerald-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-forest-900/80 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform shadow-glow-emerald">
                <item.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2 text-white group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-sage-100/80 leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 md:py-24 bg-forest-900/50 border-y border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
              Simple Process
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mt-3">
              How MarketLink Works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="rounded-3xl border border-white/10 bg-gradient-card backdrop-blur-xl p-6 text-center hover:border-emerald-500/40 hover:shadow-3d-card-hover transition-all duration-300 group"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-btn flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-sage-100/70">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
            Fresh Harvest
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mt-3">
            Fresh Produce Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {CATEGORY_SHOWCASE.map((cat, i) => (
            <motion.div
              key={cat}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="group relative h-48 rounded-3xl overflow-hidden border border-white/10 shadow-3d-card hover:shadow-3d-card-hover transition-all duration-300"
            >
              <Link to={`/products?category=${encodeURIComponent(cat)}`}>
                <img
                  src={CATEGORY_IMAGES[cat] || MARKET_STALL_IMAGE}
                  alt={cat}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/30 to-transparent" />
                <div className="absolute bottom-4 left-5 flex items-center justify-between right-5 z-10">
                  <span className="text-white font-display font-bold text-base sm:text-lg group-hover:text-emerald-300 transition-colors truncate">
                    {cat}
                  </span>
                  <ArrowRight className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-forest-900/40 py-20 md:py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
                Top Rated
              </span>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mt-2">
                Featured Products
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group shrink-0"
            >
              <span>See all</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {products === null ? (
            <SkeletonGrid count={4} className="lg:grid-cols-4" />
          ) : products.length === 0 ? (
            <p className="text-sage-100/60">No products available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Farmers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
              Verified Growers
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mt-2">
              Featured Farmers
            </h2>
          </div>
          <Link
            to="/farmers"
            className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group shrink-0"
          >
            <span>See all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {farmers === null ? (
          <SkeletonGrid count={3} className="lg:grid-cols-3" />
        ) : farmers.length === 0 ? (
          <p className="text-sage-100/60">No farmers registered yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmers.map((f, i) => (
              <motion.div
                key={f._id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
              >
                <Link
                  to={`/farmers/${f._id}`}
                  className="block rounded-3xl border border-white/10 bg-gradient-card backdrop-blur-xl p-6 hover:shadow-3d-card-hover hover:border-emerald-500/40 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-forest-900/80 border border-emerald-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    🧑‍🌾
                  </div>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                    {f.stallName}
                  </h3>
                  <p className="text-xs text-sage-100/70 mt-1 line-clamp-1">
                    {f.markets?.map((m) => m.name).join(", ") || "Independent Local Farmer"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-3 text-sm text-amber-400 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{f.ratingAverage ? f.ratingAverage.toFixed(1) : "New"}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Reviews / Testimonials */}
      {reviews.length > 0 && (
        <section className="bg-forest-900/40 py-20 md:py-24 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                Community Trust
              </span>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mt-3">
                What Customers Are Saying
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="bg-gradient-card backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-3d-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-sage-100/80 italic leading-relaxed">
                      "{r.comment}"
                    </p>
                  </div>
                  <p className="text-xs text-emerald-400 mt-4 font-semibold">
                    — {r.customer?.name || "Verified Buyer"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI Assistant Preview Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-24">
        <div className="rounded-3xl bg-gradient-hero border border-emerald-500/30 text-white p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center relative overflow-hidden shadow-3d-card">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-forest-900/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mb-4 shadow-glow-emerald">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI ASSISTANT
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-3 leading-tight">
              Not sure where to start?
            </h2>
            <p className="text-sage-100/80 mb-6 text-sm md:text-base leading-relaxed">
              Ask MarketLink's assistant things like "where can I find tomatoes?" or "which markets are open this weekend?" — grounded in real listings.
            </p>
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-btn text-white font-bold text-sm shadow-3d-card hover:scale-105 transition-transform"
            >
              <span>Try the Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="hidden md:block bg-forest-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative z-10 shadow-2xl space-y-3">
            <p className="text-xs text-sage-100/60">You asked:</p>
            <p className="text-sm bg-emerald-600/30 border border-emerald-500/30 rounded-xl px-4 py-2.5 inline-block text-emerald-200">
              Where can I find tomatoes?
            </p>
            <p className="text-xs text-sage-100/60 pt-2">MarketLink AI:</p>
            <p className="text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sage-100">
              Here's what's in stock nearby — Green Valley Farms has fresh tomatoes at Clifton Sunday Market...
            </p>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="bg-gradient-hero text-white py-16 md:py-20 border-y border-white/10 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
          <h2 className="font-display font-extrabold text-2xl md:text-4xl mb-3">
            Supporting Local, Sustainable Agriculture
          </h2>
          <p className="text-sage-100/80 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Every pre-order placed through MarketLink helps local farmers plan their harvest with confidence, reduces wasted trips, and keeps money in the local economy.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
        {[
          ["5+", "Local Markets"],
          ["40+", "Fresh Products"],
          ["12+", "Local Farmers"],
          ["100%", "Pickup, No Fees"],
        ].map(([num, label]) => (
          <div
            key={label}
            className="p-6 rounded-2xl bg-gradient-card border border-white/5 backdrop-blur-md"
          >
            <div className="font-display font-extrabold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-mint-300">
              {num}
            </div>
            <div className="text-xs md:text-sm text-sage-100/70 mt-1">
              {label}
            </div>
          </div>
        ))}
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 md:pb-24 text-center">
        <div className="rounded-3xl bg-gradient-hero border border-emerald-500/30 text-white p-10 md:p-16 shadow-3d-card relative overflow-hidden">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-3">
            Fresh food starts closer than you think.
          </h2>
          <p className="text-sage-100/80 mb-8 max-w-xl mx-auto text-sm md:text-base">
            Create your account and reserve your first pickup today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/markets"
              className="px-8 py-3.5 rounded-xl bg-gradient-btn text-white font-bold text-sm shadow-3d-card hover:scale-105 transition-all"
            >
              Explore Markets
            </Link>
            <Link
              to="/products"
              className="px-8 py-3.5 rounded-xl bg-forest-900/80 border border-white/20 text-white font-semibold text-sm backdrop-blur-md hover:bg-forest-800 transition-all"
            >
              Find Fresh Produce
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}