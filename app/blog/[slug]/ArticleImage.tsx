import Image from "next/image";
import { imageSize } from "../../../lib/images/dimensions";

interface ArticleImageProps {
  src: string;
  alt: string;
  /** Set on the one image a reader sees before scrolling, if any. */
  priority?: boolean;
}

/**
 * An inline image inside an article.
 *
 * These were plain `<img>` tags: unoptimized, served at full resolution to
 * every device, and with no reserved space, so the text reflowed as each one
 * arrived. This renders the same thing through next/image, with the intrinsic
 * size looked up from the generated dimensions map so the space is reserved
 * before the bytes land.
 *
 * The article column is 750px (`--max-width`), so that is what `sizes`
 * promises the browser; anything wider is wasted download.
 */
export function ArticleImage({ src, alt, priority = false }: ArticleImageProps) {
  const { width, height } = imageSize(src);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(max-width: 750px) 100vw, 750px"
      priority={priority}
      quality={80}
      style={{
        width: "100%",
        height: "auto",
        borderRadius: "12px",
        margin: "1rem 0",
      }}
    />
  );
}
