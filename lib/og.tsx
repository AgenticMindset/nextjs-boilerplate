import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";

/**
 * The one Open Graph card template, rendered at build time by Next's
 * ImageResponse. No design tool and no binary assets in the repo: the card is
 * laid out here in JSX and rasterised during the build.
 *
 * Deliberately typographic. A link preview is read at thumbnail size in a
 * crowded feed, so it carries a label, the title and the domain, with enough
 * contrast to survive being scaled down — not a background photo with text
 * over it.
 */

/** Open Graph's expected card size; both platforms crop around 1.91:1. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_CONTENT_TYPE = "image/png";

interface CardOptions {
  /** Small label above the title, e.g. "AI Agent". */
  eyebrow: string;
  title: string;
  /** One line under the title. Kept short; long text wraps badly at thumbnail size. */
  subtitle?: string;
}

export function ogCard({ eyebrow, title, subtitle }: CardOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // Matches the near-black the site's overlays settle on.
          background: "#0a0a0a",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#9ca3af",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: title.length > 34 ? 76 : 92,
              lineHeight: 1.08,
              color: "#fafafa",
              marginTop: 28,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 34,
                lineHeight: 1.35,
                color: "#d1d5db",
                marginTop: 28,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {/* A single accent rule, so the card reads as one family at any size. */}
          <div
            style={{
              width: 64,
              height: 6,
              background: "#fafafa",
              marginRight: 24,
            }}
          />
          <div style={{ fontSize: 30, color: "#9ca3af" }}>{SITE_NAME}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
