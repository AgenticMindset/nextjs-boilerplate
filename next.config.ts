import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback for browsers without it. AVIF costs
    // more to encode on the first request but lands ~20% smaller, which is
    // worth it for the full-bleed page backgrounds.
    formats: ["image/avif", "image/webp"],
    // Next 16 defaults this allowlist to [75], so the agents hero's
    // quality={85} was silently being coerced down to 75.
    qualities: [75, 85],
  },
};

export default nextConfig;
