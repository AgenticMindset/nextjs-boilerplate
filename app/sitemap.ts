import type { MetadataRoute } from "next";
import { AGENTS_BY_ORDER } from "../lib/agents/registry";
import { articles } from "../lib/articles";
import { absoluteUrl } from "../lib/site";

/**
 * Every indexable URL on the site, derived rather than listed.
 *
 * Agent routes come from the registry and article routes from the articles
 * list, so adding either one shows up here without anybody remembering to
 * edit a sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // The static pages change when their copy changes, which is not something
  // this file can know; build time is the honest approximation.
  const builtAt = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: builtAt, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/agents"), lastModified: builtAt, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/career"), lastModified: builtAt, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"), lastModified: builtAt, changeFrequency: "weekly", priority: 0.8 },
  ];

  const agentPages: MetadataRoute.Sitemap = AGENTS_BY_ORDER.map((agent) => ({
    url: absoluteUrl(`/agents/${agent.slug}`),
    lastModified: builtAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // An article has a real publication date, so use it rather than build time.
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/blog/${article.slug}`),
    lastModified: new Date(article.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticPages, ...agentPages, ...articlePages];
}
