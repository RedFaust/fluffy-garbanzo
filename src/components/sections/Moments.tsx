/**
 * «Ein Jahr am Kolberg» — фінальний емоційний акорд прогріву.
 * Шість моментів року, жодного прямого продажу: сцени життя, кожна
 * влучає у свій тригер (приватність, свобода, родина, безпека,
 * статус-затишок, дефіцит/інвестиція). Пін + кросфейд по скролу,
 * фон перетікає кольором доби сцени, на нічній проступають зорі.
 * Mobile / reduced-motion — вертикальний потік без піна.
 */
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useT } from "../../lib/i18n";

/* палітра доби кожної сцени: базовий фон + світіння + стокове фото */
const MOODS: { bg: string; glow: string; img?: string }[] = [
  { bg: "#0c141c", glow: "rgba(118, 170, 202, 0.14)", img: "/media/mom/m0.webp" }, // світанок над водою
  { bg: "#0e1219", glow: "rgba(158, 170, 192, 0.11)", img: "/media/mom/m1.webp" }, // ранок буднього дня
  { bg: "#101712", glow: "rgba(146, 188, 138, 0.12)", img: "/media/mom/m2.webp" }, // літній день у зелені
  { bg: "#171108", glow: "rgba(216, 160, 92, 0.14)", img: "/media/mom/m3.webp" },  // вечірнє золото воріт
  { bg: "#070a15", glow: "rgba(142, 160, 255, 0.10)", img: "/media/mom/m4.webp" }, // груднева ніч, зорі
  { bg: "#141006", glow: "rgba(223, 194, 138, 0.13)", img: "/media/mom/m5.webp" }, // «колись» — золото
  /* фінал: аерофото маєтку — «все це» одним поглядом */
  { bg: "#0a0d16", glow: "rgba(196, 161, 95, 0.10)", img: "/media/be796373-deb2-4bff-8995-13dd0672e001-1280.webp" },
];

/* детерміновані зорі (без Math.random — стабільний рендер) */
const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: ((i * 137.5) % 100),
  y: ((i * 61.8 + 13) % 88),
  r: 0.6 + ((i * 7) % 10) / 9,
  d: (i % 5) * 0.9,
}));

export default function Moments() {
  const reduced = useReducedMotion();
  const [staticMode, setStaticMode] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const upd = () => setStaticMode(!mq.matches || !!reduced);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, [reduced]);

  return staticMode ? <MomentsStatic /> : <MomentsPinned />;
}

/* ═════════ Пінований кросфейд (desktop) ═════════ */

function MomentsPinned() {
  const { t } = useT();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const T = t.moments.list.length + 1; // 6 моментів + фінал
  const stops = MOODS.map((_, i) => (i + 0.5) / T);
  const bg = useTransform(p, stops, MOODS.map((m) => m.bg));
  const glow = useTransform(p, stops, MOODS.map((m) => m.glow));
  const glowBg = useMotionTemplate`radial-gradient(62% 52% at 50% 42%, ${glow}, transparent 70%)`;
  /* зорі: проявляються лише на грудневій сцені (індекс 4) */
  const starsOn = useTransform(p, [3.6 / T, 4.1 / T, 4.9 / T, 5.4 / T], [0, 1, 1, 0]);
  const lineScale = useTransform(p, [0, 1], [0, 1]);

  /* активна сцена (для тіків і снапу) */
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  useMotionValueEvent(p, "change", (v) => {
    const i = Math.min(T - 1, Math.max(0, Math.round(v * T - 0.5)));
    activeRef.current = i;
    setActive(i);
  });

  /* поблоковий скрол: тік колеса = одна сцена, фіксація 0,9с */
  const lockUntil = useRef(0);
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const sec = ref.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const pinned = r.top <= 2 && r.bottom >= window.innerHeight - 2;
      if (!pinned) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const i = activeRef.current;
      if ((i === 0 && dir < 0) || (i === T - 1 && dir > 0)) return; // вихід на краях
      e.preventDefault();
      e.stopImmediatePropagation();
      if (performance.now() < lockUntil.current) return;
      const norm = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (Math.abs(norm) < 3) return;
      /* назад — удвічі швидше: повертатись має бути легко */
      const back = dir < 0;
      lockUntil.current = performance.now() + (back ? 450 : 900);
      const top = r.top + window.scrollY;
      const target = top + ((i + dir + 0.5) / T) * (sec.offsetHeight - window.innerHeight);
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(target, { duration: back ? 0.45 : 0.9, lock: true });
      else window.scrollTo({ top: target, behavior: "smooth" });
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, [T]);

  return (
    <section className="mom" ref={ref} style={{ height: `${T * 85}vh` }}>
      <motion.div className="mom__viewport" style={{ backgroundColor: bg }}>
        {/* стокові кадри сцен — кросфейд разом із текстом */}
        {MOODS.map((m, i) =>
          m.img ? <SceneBg key={i} p={p} i={i} total={T} src={m.img} finale={i === T - 1} /> : null
        )}
        <motion.div className="mom__glow" style={{ background: glowBg }} aria-hidden="true" />
        <motion.div className="mom__stars" style={{ opacity: starsOn }} aria-hidden="true">
          {STARS.map((s, i) => (
            <i
              key={i}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.r * 2,
                height: s.r * 2,
                animationDelay: `${s.d}s`,
              }}
            />
          ))}
        </motion.div>

        {t.moments.list.map((m, i) => (
          <Vignette key={i} p={p} i={i} total={T} time={m.time} line={m.line} />
        ))}
        <Vignette p={p} i={T - 1} total={T} time="" line={t.moments.finale} finale />

        {/* полоска прогресу з поділками сцен */}
        <div className="mom__progress" aria-hidden="true">
          <motion.i className="mom__line" style={{ scaleX: lineScale }} />
          {Array.from({ length: T }, (_, i) => (
            <i
              key={i}
              className={`mom__tick ${i <= active ? "mom__tick--on" : ""}`}
              style={{ left: `${((i + 0.5) / T) * 100}%` }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* фонове фото сцени: те саме вікно прояву, повільний наїзд */
function SceneBg({
  p,
  i,
  total,
  src,
  finale = false,
}: {
  p: MotionValue<number>;
  i: number;
  total: number;
  src: string;
  finale?: boolean;
}) {
  const s = i / total;
  const e = (i + 1) / total;
  const f = 0.3 / total;
  const opacity = useTransform(
    p,
    finale ? [s, s + f, 1] : [s, s + f, e - f, e],
    finale ? [0, 0.5, 0.5] : [0, 0.55, 0.55, 0]
  );
  const scale = useTransform(p, [s, e], [1.12, 1.02]);
  return (
    <motion.div className="mom__photo" style={{ opacity }} aria-hidden="true">
      <motion.img src={src} alt="" style={{ scale }} loading="lazy" decoding="async" />
    </motion.div>
  );
}

function Vignette({
  p,
  i,
  total,
  time,
  line,
  finale = false,
}: {
  p: MotionValue<number>;
  i: number;
  total: number;
  time: string;
  line: string;
  finale?: boolean;
}) {
  const s = i / total;
  const e = (i + 1) / total;
  const f = 0.3 / total; // ширина кросфейду
  const opacity = useTransform(
    p,
    finale ? [s, s + f, 1] : [s, s + f, e - f, e],
    finale ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(
    p,
    finale ? [s, s + f, 1] : [s, s + f, e - f, e],
    finale ? [44, 0, 0] : [44, 0, 0, -44]
  );
  const b = useTransform(
    p,
    finale ? [s, s + f, 1] : [s, s + f, e - f, e],
    finale ? [8, 0, 0] : [8, 0, 0, 8]
  );
  const blur = useMotionTemplate`blur(${b}px)`;

  return (
    <motion.div
      className={`mom__scene ${finale ? "mom__scene--finale" : ""}`}
      style={{ opacity, y, filter: blur }}
    >
      {time && <span className="mom__time">{time}</span>}
      <p className="mom__text display">{line}</p>
    </motion.div>
  );
}

/* ═════════ Вертикальний потік (mobile / reduced motion) ═════════ */

/* Фон сцени: проявляється з повільним відʼїздом (Ken Burns).
   Анімація скінченна й стартує лише коли рядок у кадрі — жодних
   вічних композитних шарів у фоні на телефоні. */
function RowBg({ src }: { src: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.img
      className="mom__rowbg"
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      initial={reduced ? false : { opacity: 0, scale: 1.18 }}
      whileInView={{ opacity: 0.42, scale: 1.03 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        opacity: { duration: 1.2, ease: "easeOut" },
        scale: { duration: 2.8, ease: [0.16, 1, 0.3, 1] },
      }}
    />
  );
}

function MomentsStatic() {
  const { t } = useT();
  const reduced = useReducedMotion();
  /* сцена «вдихає» знизу вгору: спершу кадр, за ним час, далі рядок */
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="mom mom--static">
      {t.moments.list.map((m, i) => (
        <div
          className="mom__row"
          key={i}
          style={{ backgroundColor: MOODS[i].bg, ["--mglow" as string]: MOODS[i].glow }}
        >
          {MOODS[i].img && <RowBg src={MOODS[i].img!} />}
          <div>
            <motion.span className="mom__time" {...rise(0.12)}>
              {m.time}
            </motion.span>
            <motion.p className="mom__text display" {...rise(0.22)}>
              {m.line}
            </motion.p>
          </div>
        </div>
      ))}
      <div
        className="mom__row mom__row--finale"
        style={{ backgroundColor: MOODS[6].bg, ["--mglow" as string]: MOODS[6].glow }}
      >
        {MOODS[6].img && <RowBg src={MOODS[6].img!} />}
        <motion.p className="mom__text display" {...rise(0.18)}>
          {t.moments.finale}
        </motion.p>
      </div>
    </section>
  );
}
