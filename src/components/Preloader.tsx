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

  /* Справжній прогрес за трьома віхами. Раніше шкала рахувалась від часу
     (мінімум 1.8 с), тож цифри не мали стосунку до завантаження — сайт
     міг бути готовий за 300 мс і все одно чекав. Тепер кожна віха додає
     свою частку, а щойно всі закриті — виходимо негайно. */
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const MIN = reduced ? 0 : 380; // лише щоб завіса не блимнула
    const CAP = 4000; // стеля на випадок повільної мережі

    let loaded = 0;
    const done = (w: number) => () => {
      loaded += w;
    };

    /* hero-кадр — найважчий ресурс першого екрана */
    const img = new Image();
    img.src = "/media/still-010-1280.webp";
    const hero = new Promise<void>((res) => {
      img.onload = img.onerror = () => res();
    });
    hero.then(done(0.45));

    /* шрифти: без них заголовок стрибне після зняття завіси */
    const fonts =
      (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready ??
      Promise.resolve();
    fonts.then(done(0.35));

    /* решта критичних ресурсів документа */
    const page =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((res) =>
            window.addEventListener("load", () => res(), { once: true })
          );
    page.then(done(0.2));

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setLeaving(true);
      onDone(); // hero-шторки стартують під завісою
      window.setTimeout(() => setGone(true), 700);
    };

    /* Вихід вирішують САМІ події завантаження, а не rAF: у фоновій
       вкладці кадри не малюються, і сайт чекав би до аварійного таймера. */
    let byTime = 0;
    Promise.all([hero, fonts, page]).then(() => {
      byTime = window.setTimeout(finish, Math.max(0, MIN - (performance.now() - t0)));
    });

    /* rAF лише крутить цифру — на неї нічого не зав'язано */
    const tick = (now: number) => {
      if (doneRef.current) return;
      const t = now - t0;
      /* легкий часовий поріг: шкала рухається навіть поки віхи мовчать */
      const floor = Math.min(30, (t / 800) * 30);
      const target = Math.min(96, Math.max(loaded * 100, floor));
      setProg((p) => p + (target - p) * 0.3);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* стеля на випадок, коли якийсь ресурс так і не відповів */
    const hard = window.setTimeout(finish, CAP);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hard);
      clearTimeout(byTime);
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
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: leaving ? 0.05 : 0 }}
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
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: leaving ? 0 : 0.05 }}
          >
            Anwesen <em>am Kolberg</em>
          </motion.div>
        </div>
        <motion.span
          className="preloader__addr"
          initial={{ opacity: 0 }}
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: 0.4, delay: leaving ? 0 : 0.18 }}
        >
          Bergstraße 22A · Heidesee · Brandenburg
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
