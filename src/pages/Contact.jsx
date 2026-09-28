import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import MapView from "../components/MapView.jsx";

// Static team location for the "About/Contact" page's map, per SRS 1.6.
const TEAM_LOCATION = {
  id: "team",
  lat: 24.8607,
  lng: 67.0011,
  title: "MarketLink Team",
  subtitle: "Karachi, Pakistan",
};

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true); // static contact form for this project - no backend endpoint per SRS scope
  }

  return (
    <div className="relative min-h-screen bg-brand-dark py-16 text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-mint-300/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-3">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base text-sage-300 max-w-xl mx-auto">
            Questions about MarketLink? Reach out to our team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Info & Map Column */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card space-y-4">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-sage-200">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <span>team@marketlink.test</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-sage-200">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <span>+92 300 0000000</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-sage-200">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>Karachi, Pakistan</span>
              </div>
            </div>

            {/* Map Box */}
            <div className="rounded-3xl border border-white/10 overflow-hidden shadow-3d-card bg-forest-900/40 p-2">
              <MapView points={[TEAM_LOCATION]} height="240px" zoom={12} />
            </div>
          </div>

          {/* Contact Form Column */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-card backdrop-blur-xl border border-white/10 shadow-3d-card space-y-5"
          >
            {sent ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-3d-card">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">Message Sent!</h3>
                <p className="text-xs sm:text-sm text-sage-300 leading-relaxed max-w-xs mx-auto">
                  Thanks for reaching out! We'll get back to you soon.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-sage-200 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    required
                    placeholder="Your name"
                    className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder-sage-300/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sage-200 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder-sage-300/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sage-200 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full rounded-xl bg-forest-900/60 border border-white/10 px-4 py-3 text-xs sm:text-sm text-white placeholder-sage-300/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-btn text-white font-bold text-sm shadow-3d-card hover:shadow-3d-card-hover hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                  Send Message
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}