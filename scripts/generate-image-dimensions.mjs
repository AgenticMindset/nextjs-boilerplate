// Writes lib/images/dimensions.ts from whatever is in public/.
//
// next/image needs width and height for any image not using `fill`. The blog's
// inline images are plain string paths inside TSX, not static imports, so the
// bundler has nothing to infer the intrinsic size from. Generating the map
// keeps it honest: re-run this after adding or re-encoding an image.
//
// Usage: npm run images:dimensions

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIR = "public";
const OUT = path.join("lib", "images", "dimensions.ts");

function walk(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full));
    else found.push(full);
  }
  return found;
}

const images = walk(PUBLIC_DIR)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();

const entries = [];
for (const file of images) {
  const meta = await sharp(fs.readFileSync(file)).metadata();
  const key = "/" + path.relative(PUBLIC_DIR, file).split(path.sep).join("/");
  entries.push(`  "${key}": [${meta.width}, ${meta.height}],`);
}

const header = [
  "// GENERATED FILE - do not edit by hand.",
  "//",
  "// Intrinsic pixel size of every image in public/, written by",
  "// scripts/generate-image-dimensions.mjs. next/image needs width and height",
  "// for anything not using `fill`, and the blog's inline images are plain",
  "// string paths rather than static imports, so there is nothing for the",
  "// bundler to infer them from. Having the real numbers lets <ArticleImage>",
  "// reserve the right space, so article text does not jump as images load.",
  "//",
  "// Regenerate with: npm run images:dimensions",
  "",
  "export const IMAGE_DIMENSIONS: Record<string, [number, number]> = {",
].join("\n");

const footer = [
  "};",
  "",
  "/** Intrinsic size for a public path, or a 3:2 fallback if it is unknown. */",
  "export function imageSize(src: string): { width: number; height: number } {",
  "  const hit = IMAGE_DIMENSIONS[src];",
  "  return hit ? { width: hit[0], height: hit[1] } : { width: 1200, height: 800 };",
  "}",
  "",
].join("\n");

fs.writeFileSync(OUT, `${header}\n${entries.join("\n")}\n${footer}`, "utf8");
console.log(`wrote ${OUT} with ${entries.length} entries`);
