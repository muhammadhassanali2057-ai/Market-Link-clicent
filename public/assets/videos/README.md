# Hero video asset

Place your hero video file here, named exactly:

    hero-farmers-market.mp4

Full path from the project root:

    client/public/assets/videos/hero-farmers-market.mp4

Requirements for a good result:
- Format: MP4 (H.264), muted-safe (audio track is ignored - the player is always muted)
- Recommended: 1080p or 720p, compressed for web (a few MB, not tens of MB)
- Content per the brief: farmers harvesting, fresh produce close-ups, market stall
  atmosphere - anything that reads as "local, fresh, real"
- Aspect ratio: landscape (16:9 works well); the player crops to fill via object-fit: cover

If this file is absent, or fails to load for any reason (missing, wrong path,
codec issue), the hero automatically and silently falls back to a real
photographed background (Unsplash, license-clear) with a slow Ken Burns zoom -
so the page never shows a broken video icon.

No hotlinked/remote video URL is used here on purpose: a third-party video CDN
link can go stale, violate licensing when embedded outside its origin, or be
blocked by network policy - all of which would make the hero unreliable for
your demo/judging environment. Dropping a real local file in this folder is
the only thing needed to enable it.
