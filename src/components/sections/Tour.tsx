/**
 * HAUSRUNDGANG — пінований 2D-скрол: вертикальний скрол веде камеру
 * серпантином по сітці слайдів (право → вниз → вліво → вниз → право).
 * 12 станцій: титул, 9 кімнат (галерея фото + пункти з іконками),
 * «Substanz & Technik», фінал із CTA. Справжній поблоковий скрол:
 * тік колеса = один слайд (перехоплення до Lenis, вихід на краях).
 * Пін — під хедером. Мобільний / reduced-motion — вертикальний фолбек.
 */
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight, ArrowUpRight, Bath, BedDouble, Car, ChefHat, DoorClosed,
  DoorOpen, Dumbbell, Euro, Flame, Gem, HeartPulse, Maximize2, Moon,
  Paintbrush, Palette, ShowerHead, Sparkles, Sun, Timer, Trees, Waves,
  Wind, Zap, type LucideIcon,
} from "lucide-react";
import Img from "../Img";
import { useT } from "../../lib/i18n";
import { useContactModal } from "../../lib/contactModal";
import { HAUS_SLIDES, HAUS_COLS, HAUS_ROWS, hausCell, type HausSlide } from "../../data/haus";

const N = HAUS_SLIDES.length;
const SEGS = N - 1;

const FICONS: Record<string, LucideIcon> = {
  gem: Gem, door: DoorClosed, car: Car, sparkles: Sparkles, flame: Flame,
  paint: Paintbrush, zap: Zap, chef: ChefHat, bed: BedDouble, trees: Trees,
  moon: Moon, bath: Bath, shower: ShowerHead, sun: Sun, palette: Palette,
  max: Maximize2, dumbbell: Dumbbell, pulse: HeartPulse, timer: Timer,
  dooropen: DoorOpen, euro: Euro, waves: Waves, wind: Wind,
};

/** позиція камери (в клітинках) для прогресу p ∈ [0,1].
    Лінійне відображення: плавність задає ізінг самого скролу (Lenis) —
    блок їде одним безперервним гладким рухом, симетрично в обидва боки. */
function camera(p: number) {
  const x = Math.min(Math.max(p, 0), 1) * SEGS;
  const seg = Math.min(Math.floor(x), SEGS - 1);
  const t = x - seg;
  const a = hausCell(seg);
  const b = hausCell(seg + 1);
  return { col: a.col + (b.col - a.col) * t, row: a.row + (b.row - a.row) * t };
}

/* ── Міні-мапа: серпантинний шлях крізь 12 точок ───────────────── */
const DOT_SX = 24;
const DOT_SY = 20;
const DOTS_PATH = (() => {
  let d = "";
  for (let i = 0; i < N; i++) {
    const c = hausCell(i);
    d += `${i ? " L" : "M"} ${c.col * DOT_SX + 5} ${c.row * DOT_SY + 5}`;
  }
  return d;
})();
const dotSeg = (k: number) => (hausCell(k).row === hausCell(k + 1).row ? DOT_SX : DOT_SY);
const DOTS_LEN = Array.from({ length: SEGS }, (_, k) => dotSeg(k)).reduce((a, b) => a + b, 0);
const dotsProgress = (i: number) =>
  Array.from({ length: i }, (_, k) => dotSeg(k)).reduce((a, b) => a + b, 0);

type SlideTxt = { floor: string; title: string; text: string };

export default function Tour() {
  const reduced = useReducedMotion();
  const [staticMode, setStaticMode] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const upd = () => setStaticMode(!mq.matches || !!reduced);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, [reduced]);

  return staticMode ? <StaticTour /> : <PinnedTour />;
}

/* ═════════ Пінований серпантин (desktop) ═════════ */

function PinnedTour() {
  const { t } = useT();
  const secRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  /* геометрія: пін ПІД хедером — слайд займає вікно мінус висоту nav */
  const [dims, setDims] = useState({ navH: 68, w: 1280, h: 720 });
  useEffect(() => {
    const upd = () => {
      const nav = document.querySelector<HTMLElement>(".nav");
      const navH = nav?.offsetHeight ?? 68;
      setDims({ navH, w: window.innerWidth, h: window.innerHeight - navH });
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  const { scrollYProgress } = useScroll({ target: secRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -camera(p).col * dims.w);
  const y = useTransform(scrollYProgress, (p) => -camera(p).row * dims.h);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.round(Math.min(Math.max(p, 0), 1) * SEGS);
    activeRef.current = i;
    setActive(i);
  });

  const scrollToIndex = (i: number, duration = 1.05) => {
    const sec = secRef.current;
    if (!sec) return;
    const top = sec.getBoundingClientRect().top + window.scrollY;
    const target = top + (i / SEGS) * (sec.offsetHeight - window.innerHeight);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(target, { duration, lock: true });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  /* СПРАВЖНІЙ поблоковий скрол: тік колеса = один слайд.
     Поки секція запінена — перехоплюємо wheel (до Lenis, capture-фазою),
     на краях віддаємо скрол назад сторінці. */
  const lockUntil = useRef(0);
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const sec = secRef.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const pinned = r.top <= dims.navH + 2 && r.bottom >= window.innerHeight - 2;
      if (!pinned) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const i = activeRef.current;
      /* вихід із секції нативним скролом на краях */
      if ((i === 0 && dir < 0) || (i === N - 1 && dir > 0)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      /* загальна фіксація 0,9с — часова мітка, а не таймер:
         один тік ніколи не дає більше одного слайда */
      if (performance.now() < lockUntil.current) return;
      /* нормалізація: deltaMode 1 = рядки, 2 = сторінки; поріг мінімальний —
         БУДЬ-ЯКИЙ помітний рух колеса перемикає рівно один слайд */
      const norm = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (Math.abs(norm) < 3) return;
      lockUntil.current = performance.now() + 900;
      /* тривалість = лок: рух безперервний, без «замирання» в кінці */
      scrollToIndex(i + dir, 0.9);
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims.navH]);

  /* стрибок до слайда через міні-мапу */
  const jumpTo = (i: number) => scrollToIndex(i, 1.4);

  return (
    <section className="haus" id="tour" ref={secRef} style={{ height: `${N * 100}vh` }}>
      <div className="haus__viewport" style={{ top: dims.navH, height: dims.h }}>
        <motion.div
          className="haus__track"
          style={{ x, y, width: HAUS_COLS * dims.w, height: HAUS_ROWS * dims.h }}
        >
          {HAUS_SLIDES.map((s, i) => {
            const c = hausCell(i);
            return (
              <div
                key={s.id}
                className="haus__cell"
                style={{ left: c.col * dims.w, top: c.row * dims.h, width: dims.w, height: dims.h }}
              >
                <Slide s={s} on={active === i} txt={t.haus.slides[i]} />
              </div>
            );
          })}
        </motion.div>

        {/* HUD: лічильник + назва */}
        <div className="haus__hud" aria-hidden="true">
          <span className="haus__hud-count">
            {String(active + 1).padStart(2, "0")}
            <i>/ {N}</i>
          </span>
          <span className="haus__hud-name">{t.haus.slides[active].floor || t.haus.kicker}</span>
        </div>

        {/* серпантинна міні-мапа — по центру знизу, з золотим шляхом */}
        <div className="haus__dots" role="tablist" aria-label={t.haus.kicker}>
          <svg viewBox="0 0 82 50" className="haus__dots-svg" aria-hidden="true">
            <path d={DOTS_PATH} className="haus__dots-base" />
            <path
              d={DOTS_PATH}
              className="haus__dots-gold"
              style={{
                strokeDasharray: DOTS_LEN,
                strokeDashoffset: DOTS_LEN - dotsProgress(active),
              }}
            />
          </svg>
          {HAUS_SLIDES.map((s, i) => {
            const c = hausCell(i);
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === active}
                aria-label={`${i + 1} · ${t.haus.slides[i].floor || t.haus.slides[i].title}`}
                title={t.haus.slides[i].floor || t.haus.slides[i].title}
                className={`haus__dot ${i === active ? "haus__dot--on" : ""} ${i < active ? "haus__dot--seen" : ""}`}
                style={{ left: `${c.col * DOT_SX}px`, top: `${c.row * DOT_SY}px` }}
                onClick={() => jumpTo(i)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═════════ Галерея головного фото з мініатюрами ═════════ */

function Gallery({ s, alt, on, cls }: { s: HausSlide; alt: string; on: boolean; cls: string }) {
  const [ph, setPh] = useState(0);
  const photos = s.photos && s.photos.length > 1 ? s.photos : null;
  const cur = photos?.[ph] ?? s.main!;
  return (
    <motion.div
      className={cls}
      animate={on ? { scale: 1, opacity: 1 } : { scale: 1.06, opacity: 0.75 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Img key={cur} slug={cur} alt={alt} sizes="(max-width: 900px) 100vw, 52vw" />
      {photos && (
        <div className="haus__thumbs" role="tablist" aria-label={alt}>
          {photos.map((p, k) => (
            <button
              key={p}
              role="tab"
              aria-selected={k === ph}
              aria-label={`${k + 1}`}
              className={`haus__thumb ${k === ph ? "haus__thumb--on" : ""}`}
              onClick={() => setPh(k)}
            >
              <Img slug={p} alt="" sizes="72px" eager />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ═════════ Слайд ═════════ */

function Slide({ s, on, txt }: { s: HausSlide; on: boolean; txt: SlideTxt }) {
  const { t, lang } = useT();
  const { open } = useContactModal();
  const [ph, setPh] = useState(0);
  const acc = { "--acc": s.accent } as React.CSSProperties;

  /* пункти-переваги кімнати: іконка + підпис, каскадний прояв */
  const Feats = () =>
    s.features ? (
      <div className="haus__feats">
        {s.features.map((f, k) => {
          const FI = FICONS[f.icon] ?? Sparkles;
          return (
            <motion.div
              key={f.de}
              className="haus__feat"
              animate={on ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }}
              transition={{ duration: 0.5, delay: on ? 0.45 + k * 0.09 : 0, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="haus__feat-ic" aria-hidden="true">
                <FI size={15} strokeWidth={1.8} />
              </span>
              <span className="haus__feat-l">{lang === "de" ? f.de : f.en}</span>
            </motion.div>
          );
        })}
      </div>
    ) : null;

  /* текстова колонка з каскадним проявом при прибутті камери */
  const Txt = ({ children, center = false }: { children?: React.ReactNode; center?: boolean }) => (
    <div className={`haus__txt ${center ? "haus__txt--center" : ""}`}>
      <motion.span
        className="haus__floor"
        animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.5, delay: on ? 0.15 : 0 }}
      >
        {txt.floor}
      </motion.span>
      <motion.h3
        className="haus__title display"
        animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 0.65, delay: on ? 0.25 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {txt.title}
      </motion.h3>
      <motion.p
        className="haus__text"
        animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
        transition={{ duration: 0.6, delay: on ? 0.38 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {txt.text}
      </motion.p>
      <Feats />
      {children}
    </div>
  );

  /* другорядне фото з м'яким «прибуттям» */
  const Photo = ({ slug, cls, sizes }: { slug: string; cls: string; sizes: string }) => (
    <motion.div
      className={cls}
      animate={on ? { scale: 1, opacity: 1 } : { scale: 1.07, opacity: 0.75 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Img slug={slug} alt={txt.title} sizes={sizes} />
    </motion.div>
  );

  switch (s.variant) {
    case "title":
      return (
        <div className="haus__slide haus__slide--title" style={acc}>
          <div className="haus__bg">
            <Img slug={s.main!} alt="" sizes="100vw" />
          </div>
          <div className="haus__veil" />
          <Txt center>
            <motion.div
              className="haus__facts"
              animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: on ? 0.5 : 0 }}
            >
              {t.haus.facts.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </motion.div>
            <motion.span
              className="haus__hint"
              animate={on ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: on ? 0.7 : 0 }}
            >
              {t.haus.scrollHint}
              <ArrowRight size={15} aria-hidden="true" />
            </motion.span>
          </Txt>
        </div>
      );

    case "cover": {
      const photos = s.photos && s.photos.length > 1 ? s.photos : null;
      const cur = photos?.[ph] ?? s.main!;
      return (
        <div className="haus__slide haus__slide--cover" style={acc}>
          <div className="haus__bg" style={s.origin ? { ["--origin" as string]: s.origin } : undefined}>
            <Img key={cur} slug={cur} alt={txt.title} sizes="100vw" />
          </div>
          <div className="haus__veil haus__veil--cover" />
          <Txt>
            {photos && (
              <div className="haus__thumbs haus__thumbs--cover" role="tablist">
                {photos.map((p, k) => (
                  <button
                    key={p}
                    role="tab"
                    aria-selected={k === ph}
                    aria-label={`${k + 1}`}
                    className={`haus__thumb ${k === ph ? "haus__thumb--on" : ""}`}
                    onClick={() => setPh(k)}
                  >
                    <Img slug={p} alt="" sizes="72px" eager />
                  </button>
                ))}
              </div>
            )}
          </Txt>
          {s.second && <Photo slug={s.second} cls="haus__float" sizes="26vw" />}
        </div>
      );
    }

    case "specs":
      return (
        <div className="haus__slide haus__slide--specs" style={acc}>
          <div className="haus__bg haus__bg--faint">
            <Img slug={s.main!} alt="" sizes="100vw" />
          </div>
          <div className="haus__veil" />
          <div className="haus__grid">
            <Txt />
            <div className="haus__specs">
              {t.haus.specs.map((sp, k) => (
                <motion.div
                  key={sp.l}
                  className="haus__spec"
                  animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                  transition={{ duration: 0.55, delay: on ? 0.3 + k * 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
                >
                  <b>{sp.v}</b>
                  <span>{sp.l}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      );

    case "finale":
      return (
        <div className="haus__slide haus__slide--finale" style={acc}>
          <div className="haus__bg">
            <Img slug={s.main!} alt="" sizes="100vw" />
          </div>
          <div className="haus__veil haus__veil--finale" />
          <Txt center>
            <motion.div
              className="haus__cta"
              animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.6, delay: on ? 0.5 : 0 }}
            >
              <button className="btn btn--gold btn--xl" onClick={() => open("viewing")}>
                {t.haus.cta}
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>
              <span className="haus__cta-note">{t.haus.ctaNote}</span>
            </motion.div>
          </Txt>
        </div>
      );

    /* split / duo — редакційні композиції, дзеркаляться */
    default:
      return (
        <div
          className={`haus__slide haus__slide--${s.variant} ${s.mirror ? "haus__slide--mirror" : ""}`}
          style={acc}
        >
          {/* фон: те саме фото кімнати, сильно заблурене */}
          <div className="haus__bg haus__bg--blur" aria-hidden="true">
            <Img slug={s.main!} alt="" sizes="640px" />
          </div>
          <div className="haus__grid">
            <div className="haus__media">
              <Gallery s={s} alt={txt.title} on={on} cls="haus__main" />
            </div>
            <Txt />
          </div>
        </div>
      );
  }
}

/* ═════════ Вертикальний фолбек (mobile / reduced motion) ═════════ */

function StaticTour() {
  const { t, lang } = useT();
  const { open } = useContactModal();

  return (
    <div className="haus haus--static" id="tour">
      {HAUS_SLIDES.map((s, i) => {
        const txt = t.haus.slides[i];
        return (
          <article key={s.id} className={`hstat hstat--${s.variant}`} style={{ "--acc": s.accent } as React.CSSProperties}>
            {(s.variant === "title" || s.variant === "cover" || s.variant === "finale") && s.main ? (
              <div className="hstat__bg">
                <Img slug={s.main} alt="" sizes="100vw" />
              </div>
            ) : (
              s.main && <Gallery s={s} alt={txt.title} on cls="hstat__photo" />
            )}
            <div className="hstat__body">
              <span className="haus__floor">{txt.floor}</span>
              <h3 className="haus__title display">{txt.title}</h3>
              <p className="haus__text">{txt.text}</p>
              {s.features && (
                <div className="haus__feats">
                  {s.features.map((f) => {
                    const FI = FICONS[f.icon] ?? Sparkles;
                    return (
                      <div key={f.de} className="haus__feat">
                        <span className="haus__feat-ic" aria-hidden="true">
                          <FI size={15} strokeWidth={1.8} />
                        </span>
                        <span className="haus__feat-l">{lang === "de" ? f.de : f.en}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {s.variant === "title" && (
                <div className="haus__facts">
                  {t.haus.facts.map((f) => (
                    <span key={f}>{f}</span>
                  ))}
                </div>
              )}
              {s.variant === "specs" && (
                <div className="haus__specs">
                  {t.haus.specs.map((sp) => (
                    <div key={sp.l} className="haus__spec">
                      <b>{sp.v}</b>
                      <span>{sp.l}</span>
                    </div>
                  ))}
                </div>
              )}
              {s.variant === "finale" && (
                <div className="haus__cta">
                  <button className="btn btn--gold btn--xl" onClick={() => open("viewing")}>
                    {t.haus.cta}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </button>
                  <span className="haus__cta-note">{t.haus.ctaNote}</span>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
