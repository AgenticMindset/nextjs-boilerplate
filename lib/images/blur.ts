// Tiny inline previews so full-bleed background photos fade in from
// something rather than from empty space. Generated with sharp at 12px wide:
//   sharp(src).resize(12).webp({ quality: 40 }).toBuffer()
// Each one is well under 150 bytes, so they cost less than the request they
// save.
export const AGENTS_BG_BLUR =
  "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAwCdASoMABIAPu1iqk2ppaQiMAgBMB2JZQCdACFNy/gELBcnKAAA/u6IXu05CMB+FtjYIZafC/P1O5dvaJFsMPaHmnZaGQhGdoGAAAA=";
