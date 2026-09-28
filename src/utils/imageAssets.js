/**
 * Curated real photography used across the app (hero background,
 * category imagery, and as a fallback when a product/farmer has no
 * uploaded image of its own). All sourced from Unsplash under the
 * Unsplash License (free to use, no attribution required) via direct
 * CDN links - see README "Image & Video Assets" section for details
 * and for how to swap these for your own photography later.
 */
export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1759003103614-11427d946af0?fm=jpg&q=80&w=2400&auto=format&fit=crop";

// Optional local hero video: drop a file at
// client/public/assets/videos/hero-farmers-market.mp4 and it will play
// automatically; if it's missing or fails to load, the Hero component
// falls back to HERO_IMAGE with a Ken Burns zoom. See the README in
// that folder for exact requirements.
export const HERO_VIDEO_SRC = "/assets/videos/hero-farmers-market.mp4";

export const CATEGORY_IMAGES = {
  Vegetables: "https://images.unsplash.com/photo-1705928629040-c701a1e70531?fm=jpg&q=75&w=1200&auto=format&fit=crop",
  Fruits: "https://images.unsplash.com/photo-1753379038304-03b314ed8901?fm=jpg&q=75&w=1200&auto=format&fit=crop",
  "Baked Goods": "https://images.unsplash.com/photo-1668724063394-dc6716fc6bd6?fm=jpg&q=75&w=1200&auto=format&fit=crop",
  // Categories below reuse the closest available real photo rather than
  // a placeholder - documented in the README as a deliberate scope
  // decision rather than an oversight.
  Dairy: "https://images.unsplash.com/photo-1705928629040-c701a1e70531?fm=jpg&q=75&w=1200&auto=format&fit=crop",
  Herbs: "https://images.unsplash.com/photo-1705928629040-c701a1e70531?fm=jpg&q=75&w=1200&auto=format&fit=crop",
  "Organic Produce": "https://images.unsplash.com/photo-1759003103614-11427d946af0?fm=jpg&q=75&w=1200&auto=format&fit=crop",
  "Seasonal Produce": "https://images.unsplash.com/photo-1753379038304-03b314ed8901?fm=jpg&q=75&w=1200&auto=format&fit=crop",
  Other: "https://images.unsplash.com/photo-1705928629040-c701a1e70531?fm=jpg&q=75&w=1200&auto=format&fit=crop",
};

export const MARKET_STALL_IMAGE = CATEGORY_IMAGES.Vegetables;

export function getCategoryImage(categoryName) {
  return CATEGORY_IMAGES[categoryName] || MARKET_STALL_IMAGE;
}
