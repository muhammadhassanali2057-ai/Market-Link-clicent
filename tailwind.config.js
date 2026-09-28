/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Original eGreen Basket Palette Preserved ---
        forest: { 
          50: "#f2f7f2", 100: "#dcebdd", 200: "#c3ddc6", 300: "#8fbf93", 
          500: "#3f7d47", 600: "#2f6338", 700: "#264f2d", 800: "#1c3a21", 900: "#0f2413" 
        },
        emerald: { 500: "#1f9d63", 600: "#168050" },
        sage: { 100: "#e7ecdf", 300: "#b9c7a6", 500: "#8a9b73" },
        mint: { 100: "#dcf3e6", 200: "#bfe8d3", 300: "#a8e0c3" },
        cream: "#faf7f0",
        beige: "#f1e9d8",
        charcoal: "#23261f",
        earth: { 300: "#c9a876", 500: "#a97e4b" },

        // --- New Modern 3D & Linear Gradient Additions ---
        brand: {
          dark: "#03170d",
          surface: "rgba(15, 36, 20, 0.65)",
          glow: "#00FF9D",
          accent: "#84CC16",
        },
      },
      backgroundImage: {
        // --- 3D Linear Gradients ---
        'gradient-hero': 'linear-gradient(135deg, #0f2413 0%, #1c3a21 40%, #03170d 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'gradient-card-hover': 'linear-gradient(135deg, rgba(31, 157, 99, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-emerald-glow': 'radial-gradient(circle at center, rgba(31, 157, 99, 0.35) 0%, rgba(0, 0, 0, 0) 70%)',
        'gradient-btn': 'linear-gradient(135deg, #1f9d63 0%, #3f7d47 50%, #168050 100%)',
      },
      boxShadow: {
        // --- Real 3D Depth & Tilt Shadows ---
        '3d-card': '0 20px 35px -10px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(31, 157, 99, 0.15)',
        '3d-card-hover': '0 30px 60px -12px rgba(31, 157, 99, 0.35), 0 18px 36px -18px rgba(0, 0, 0, 0.7)',
        'glow-emerald': '0 0 25px rgba(31, 157, 99, 0.5)',
        'glow-mint': '0 0 25px rgba(168, 224, 195, 0.4)',
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "Georgia", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1.08) translate(0, 0)" },
          "100%": { transform: "scale(1.18) translate(-1%, -1%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        // --- New 3D Keyframes ---
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.08)" },
        },
        tilt3d: {
          "0%, 100%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "50%": { transform: "rotateX(6deg) rotateY(-6deg)" },
        },
      },
      animation: {
        kenburns: "kenburns 20s ease-out forwards",
        floaty: "floaty 6s ease-in-out infinite",
        'pulse-glow': "pulseGlow 4s ease-in-out infinite",
        'tilt-3d': "tilt3d 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};