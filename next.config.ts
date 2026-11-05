import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback for browsers without it. AVIF costs
    // more to encode on the first request but lands ~20% smaller, which is
    // worth it for the full-bleed page backgrounds.
    formats: ["image/avif", "image/webp"],
    // Next 16 made this allowlist required and defaults it to [75]. A
    // request for a quality outside it is rejected with a 400, not coerced,
    // so every value any <Image quality> prop asks for has to be listed:
    // 75 (blog thumbnails), 80 (home and blog heroes), 85 (agents and
    // career heroes), 90 (the profile portrait).
    qualities: [75, 80, 85, 90],
  },
};

export default nextConfig;
