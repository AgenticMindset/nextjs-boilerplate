// GENERATED FILE - do not edit by hand.
//
// Intrinsic pixel size of every image in public/, written by
// scripts/generate-image-dimensions.mjs. next/image needs width and height
// for anything not using `fill`, and the blog's inline images are plain
// string paths rather than static imports, so there is nothing for the
// bundler to infer them from. Having the real numbers lets <ArticleImage>
// reserve the right space, so article text does not jump as images load.
//
// Regenerate with: npm run images:dimensions

export const IMAGE_DIMENSIONS: Record<string, [number, number]> = {
  "/AT_fair_square.jpg": [848, 1020],
  "/agents-bg.jpg": [1733, 2600],
  "/ams4-bg.jpg": [1920, 1440],
  "/apple-touch-icon.png": [180, 171],
  "/blog-bg.jpg": [1463, 2600],
  "/blog/GEO-pillars.jpg": [1100, 619],
  "/blog/agent-market-fit-cover.jpg": [960, 640],
  "/blog/bank-article.jpg": [1600, 2400],
  "/blog/city-bg.jpg": [1920, 1271],
  "/blog/ecb-article.jpg": [1600, 2000],
  "/blog/geo-cover.jpg": [1100, 733],
  "/blog/geo-just-start.webp": [1100, 728],
  "/blog/geo-phone.png": [1200, 644],
  "/blog/gpu-1.jpg": [1600, 835],
  "/blog/iceberg-theory-cover.jpg": [960, 640],
  "/blog/iceberg-theory-layers.jpg": [960, 628],
  "/blog/iceberg-theory-wall.jpg": [960, 641],
  "/blog/msi-1.jpg": [1600, 1200],
  "/blog/semantic-cover.jpg": [1600, 1067],
  "/blog/semantic-graph.jpg": [892, 619],
  "/blog/semantic-roll.jpg": [1800, 1200],
  "/blog/singularity-cover.jpg": [572, 516],
  "/blog/singularity-middle.png": [1200, 673],
  "/blog/vector-space-model.jpg": [1264, 798],
  "/blog/world-models-cover.jpg": [960, 520],
  "/blog/world-models-inline.jpg": [960, 483],
  "/blog/your-margin-is-your-metadata.jpg": [960, 543],
  "/build-bg.jpg": [1920, 1281],
  "/icon-192.png": [192, 183],
  "/icon-512.png": [512, 487],
};

/** Intrinsic size for a public path, or a 3:2 fallback if it is unknown. */
export function imageSize(src: string): { width: number; height: number } {
  const hit = IMAGE_DIMENSIONS[src];
  return hit ? { width: hit[0], height: hit[1] } : { width: 1200, height: 800 };
}
