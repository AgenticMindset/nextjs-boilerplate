import type { MetadataRoute } from "next";
import { absoluteUrl } from "../lib/site";

/**
 * Everything here is meant to be found, so the only thing disallowed is
 * `/api`, which holds the agent endpoints: they are POST-only, cost tokens
 * from a shared free tier, and have nothing for a crawler to index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
