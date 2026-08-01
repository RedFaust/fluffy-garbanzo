/**
 * Кастомний курсор (desktop, pointer:fine):
 * — точка + кільце без відставання (одна позиція, без пружини);
 * — над клікабельним: легке збільшення, золота заливка, підпис Klick/Click;
 * — спалах-кільце при кліку;
 * — над драг-зонами [data-cursor="hand"] — скетч-рука (як у референсі).
 * Нативний вказівник вимкнено глобально (html.has-cursor).
 */
import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useT } from "../lib/i18n";

type Mode = "default" | "hot" | "hand";

const HOT_SEL =
  "a,button,[role=tab],[role=radio],input,textarea,label,.geo__dot,.geo__item";

/** Скетч-рука (інлайн, без зовнішнього файла — гарантовано рендериться) */
function HandGlyph() {
  return (
    <svg className="cursor__hand" viewBox="0 0 64 74" aria-hidden="true">
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M 10 46 C 4.5 41, 3.5 33, 8.5 30 C 12 28, 15.5 30.5, 16.5 35.5
             L 16.5 16 C 16.5 11, 24 11, 24 16 L 24 30
             C 24.6 32.4, 27.4 32.4, 28 30 L 28 9 C 28 4, 35 4, 35 9 L 35 30
             C 35.6 32.4, 38.4 32.4, 39 30 L 39 13 C 39 8.4, 46 8.4, 46 13 L 46 31.5
             C 46.6 33.6, 48.6 33.6, 49.2 31.5 L 49.2 21.5 C 49.2 17, 55 17.6, 55 22
             L 55.2 44 C 55.5 57, 48.5 68, 34.5 68.3 C 22.5 68.6, 14 61, 10 46 Z"
          fill="#d9a93e"
          stroke="#262019"
          strokeWidth="2.8"
        />
        <path
          d="M 20 44 L 38 36 M 22 52 L 42 43 M 27 59 L 45 51"
          fill="none" stroke="#b8860b" strokeWidth="1.7" opacity="0.55"
        />
        <path
          d="M 24 40 L 40 33 M 25 56 L 43 48"
          fill="none" stroke="#e8c979" strokeWidth="1.4" opacity="0.6"
        />
        <path
          d="M 19 33 L 22 33 M 30.5 32 L 33 32 M 41 34 L 44 34 M 50 36 L 53 36"
          fill="none" stroke="#262019" strokeWidth="1.5" opacity="0.7"
        />
        <path
          d="M 11.5 47 C 6.5 42, 5.5 34.5, 9.5 31.5 M 17.2 16.5 C 17.4 12.5, 23 12.3, 23.4 16.3 M 28.8 9.5 C 29.2 5.5, 34.2 5.5, 34.4 9.3 M 39.8 13.5 C 40.2 9.9, 45 9.9, 45.4 13.5"
          fill="none" stroke="#262019" strokeWidth="1.2" opacity="0.45"
        />
      </g>
    </svg>
  );
}

export default function Cursor() {
  const reduced = useReducedMotion();
  const { t } = useT();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [pressed, setPressed] = useState(false);
  const [burst, setBurst] = useState<{ x: number; y: number; k: number } | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const resolve = (el: Element | null): Mode => {
      if (!el || !(el instanceof Element)) return "default";
      if (el.closest(HOT_SEL)) return "hot";
      if (el.closest('[data-cursor="hand"]')) return "hand";
      return "default";
    };
    /* під час перетягування «рука» не зникає, навіть якщо target змінився */
    let dragHand = false;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const m = resolve(e.target as Element);
      setMode(dragHand ? "hand" : m);
    };
    const down = (e: MouseEvent) => {
      setPressed(true);
      if (resolve(e.target as Element) === "hand") dragHand = true;
      setBurst({ x: e.clientX, y: e.clientY, k: performance.now() });
    };
    const up = (e: MouseEvent) => {
      setPressed(false);
      dragHand = false;
      setMode(resolve(e.target as Element));
    };
    const leave = () => setMode("default");

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className={`cursor cursor--${mode} ${pressed ? "cursor--down" : ""}`}
        style={{ x, y }}
        aria-hidden="true"
      >
        <i className="cursor__dot" />
        <i className="cursor__ring" />
        <span className="cursor__label">{t.clickCue}</span>
        <HandGlyph />
      </motion.div>
      {burst && (
        <span
          key={burst.k}
          className="cursor-burst"
          style={{ left: `${burst.x}px`, top: `${burst.y}px` }}
          onAnimationEnd={() => setBurst(null)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
