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
  async headers() {
    return [
      {
        // Everything on this site is public and static-ish, so these apply
        // site-wide rather than per route.
        source: "/:path*",
        headers: [
          // Only ever reachable over HTTPS, including future subdomains.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Nothing here is meant to be framed by anyone else.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            // microphone stays enabled for this origin: the Voice Coach is
            // built on getUserMedia and a blanket microphone=() would break
            // it. Camera, geolocation and ad-topics are switched off, since
            // nothing here asks for them.
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(self), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
