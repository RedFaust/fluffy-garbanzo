/**
 * Розумне зображення: srcset із маніфесту + blur-up заглушка + lazy.
 * Використання: <Img slug="still-010" alt="…" sizes="100vw" />
 */
import { useState } from "react";
import manifest from "../data/media-manifest.json";

type Entry = {
  slug: string;
  width: number;
  height: number;
  aspect: number;
  blur: string;
  sizes: Record<string, { path: string; kb: number }>;
};

const M = manifest as unknown as Record<string, Entry>;

export default function Img({
  slug,
  alt,
  sizes = "100vw",
  eager = false,
  className,
  style,
}: {
  slug: string;
  alt: string;
  sizes?: string;
  eager?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [loaded, setLoaded] = useState(false);
  const e = M[slug];
  if (!e) {
    console.warn("[Img] немає в маніфесті:", slug);
    return null;
  }
  const srcset = Object.entries(e.sizes)
    .map(([w, s]) => `${s.path} ${w}w`)
    .join(", ");
  const fallback = e.sizes["1280"]?.path ?? Object.values(e.sizes)[0]?.path;

  return (
    <img
      src={fallback}
      srcSet={srcset}
      sizes={sizes}
      alt={alt}
      width={e.width}
      height={e.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
      onLoad={() => setLoaded(true)}
      onError={(ev) => {
        // одноразовий ретрай — лікує зрив декодування на першому пейнті
        const img = ev.currentTarget;
        if (!img.dataset.retried) {
          img.dataset.retried = "1";
          const s = img.src;
          setTimeout(() => {
            img.src = "";
            img.src = s;
          }, 250);
        }
      }}
      className={className}
      style={{
        backgroundImage: loaded ? undefined : `url(${e.blur})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...style,
      }}
    />
  );
}
