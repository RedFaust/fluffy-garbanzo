/**
 * Прелоудер «Золоте кільце»: реальний прогрес (hero-фото + шрифти),
 * кільце-дуга з монограмою K, відсоток, золотий пил і паралакс
 * шарів від курсора. Вихід — завіса вгору, синхронізована зі
 * шторками hero (onDone на старті виходу).
 */
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

/* детермінований золотий пил */
const DUST = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 61.8 + 9) % 100,
  s: 2 + ((i * 7) % 3),
  d: (i % 7) * 0.9,
  dur: 7 + (i % 5) * 2,
}));

const R = 74;
const C = 2 * Math.PI * R;

export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [prog, setProg] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(false);

  /* паралакс шарів від курсора (пружини — рух живий, але м'який) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 15 });
  const sy = useSpring(my, { stiffness: 55, damping: 15 });
  const dustX = useTransform(sx, (v) => v * -30);
  const dustY = useTransform(sy, (v) => v * -30);
  const ringX = useTransform(sx, (v) => v * 16);
  const ringY = useTransform(sy, (v) => v * 12);
  const ringRX = useTransform(sy, (v) => v * -9);
  const ringRY = useTransform(sx, (v) => v * 11);
  const wordX = useTransform(sx, (v) => v * 8);
  const wordY = useTransform(sy, (v) => v * 6);

  useEffect(() => {
    const mm = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", mm, { passive: true });
    return () => window.removeEventListener("mousemove", mm);
  }, [mx, my]);

  /* реальний прогрес: hero-фото + шрифти, мінімум 1.8с на церемонію */
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    let assets = false;
    const img = new Image();
    img.src = "/media/still-010-1280.webp";
    Promise.all([
      new Promise((res) => {
        img.onload = img.onerror = res;
      }),
      (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready ??
        Promise.resolve(),
    ]).then(() => {
      assets = true;
    });
    const MIN = reduced ? 500 : 1800;

    const tick = (now: number) => {
      const t = now - t0;
      const base = Math.min(90, (t / MIN) * 90);
      const target = assets && t >= MIN ? 100 : base;
      setProg((p) => {
        const n = p + (target - p) * 0.14;
        if (n >= 99.2 && !doneRef.current) {
          doneRef.current = true;
          setLeaving(true);
          onDone(); // hero-шторки стартують під завісою
          window.setTimeout(() => setGone(true), 1000);
        }
        return n;
      });
      if (!doneRef.current) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    /* страховка: фонова вкладка (rAF призупинено) не має блокувати сайт */
    const hard = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        setLeaving(true);
        onDone();
        window.setTimeout(() => setGone(true), 1000);
      }
    }, 7000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hard);
    };
  }, [onDone, reduced]);

  if (gone) return null;

  const shown = leaving ? 100 : Math.round(prog);
  const off = C * (1 - (leaving ? 100 : prog) / 100);
  const para = reduced ? undefined : true;

  return (
    <motion.div
      className="preloader"
      initial={false}
      animate={leaving ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: leaving ? 0.2 : 0 }}
      aria-hidden="true"
    >
      {/* золотий пил */}
      <motion.div
        className="preloader__dust"
        style={para ? { x: dustX, y: dustY } : undefined}
      >
        {DUST.map((p, i) => (
          <i
            key={i}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.s,
              height: p.s,
              animationDelay: `${p.d}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </motion.div>

      {/* кільце прогресу + монограма */}
      <motion.div
        className="preloader__ringwrap"
        style={para ? { x: ringX, y: ringY, rotateX: ringRX, rotateY: ringRY } : undefined}
        animate={leaving ? { scale: 1.14, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 180 180" className="preloader__ring">
          <defs>
            <linearGradient id="pl-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f0e2bd" />
              <stop offset="1" stopColor="#c4a15f" />
            </linearGradient>
          </defs>
          <circle cx="90" cy="90" r={R} className="preloader__ring-base" />
          <circle
            cx="90"
            cy="90"
            r={R}
            className="preloader__ring-fill"
            stroke="url(#pl-gold)"
            strokeDasharray={C}
            strokeDashoffset={off}
            transform="rotate(-90 90 90)"
          />
        </svg>
        <span className="preloader__mono display">K</span>
        <span className="preloader__pct">{shown}%</span>
      </motion.div>

      {/* вордмарк + адреса */}
      <motion.div
        className="preloader__brand"
        style={para ? { x: wordX, y: wordY } : undefined}
      >
        <div className="preloader__word">
          <motion.div
            initial={{ y: "115%" }}
            animate={{ y: leaving ? "-115%" : "0%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: leaving ? 0 : 0.25 }}
          >
            Anwesen <em>am Kolberg</em>
          </motion.div>
        </div>
        <motion.span
          className="preloader__addr"
          initial={{ opacity: 0 }}
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: 0.6, delay: leaving ? 0 : 0.55 }}
        >
          Bergstraße 22A · Heidesee · Brandenburg
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
