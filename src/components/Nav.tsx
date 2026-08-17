/**
 * Верхня навігація: прозора на старті, прогресивний блюр-скло при скролі,
 * виразні пункти меню, золота CTA → спливаюча форма.
 */
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useT, type Lang } from "../lib/i18n";
import { useContactModal } from "../lib/contactModal";

export default function Nav() {
  const { lang, setLang, t } = useT();
  const { open } = useContactModal();
  const [solid, setSolid] = useState(false);
  /* Пройшли ~30% першого екрана — на телефоні хедер перебудовується:
     назва згортається, перемикач мови їде ліворуч, а праворуч стає
     та сама CTA, що й на десктопі (див. .nav--compact у CSS). */
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 28);
      setCompact(y > window.innerHeight * 0.3);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const links: [string, string][] = [
    ["#plans", t.nav.plans],
    ["#location", t.nav.location],
    ["#tour", t.nav.chapters],
    ["#contact", t.nav.contact],
  ];

  return (
    <header className={`nav ${solid ? "nav--solid" : ""} ${compact ? "nav--compact" : ""}`}>
      <a href="#top" className="nav__brand">
        Anwesen <em>am Kolberg</em>
      </a>
      <nav className="nav__links" aria-label="Hauptnavigation">
        {links.map(([href, label]) => (
          <a key={href} href={href} className="nav__link">
            {label}
          </a>
        ))}
      </nav>
      <div className="nav__right">
        <div className="nav__lang" role="group" aria-label="Sprache">
          {(["de", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              className={lang === l ? "active" : ""}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="nav__cta" onClick={() => open("viewing")}>
          {t.nav.cta}
          <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
