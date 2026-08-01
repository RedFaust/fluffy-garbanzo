/**
 * Кінематографічні примітиви появи (Motion).
 * ВАЖЛИВО: кінцевий стан завжди видимий; для елементів усередині pinned-сцен
 * використовуйте скрол-керовані варіанти в Tour, а не IO.
 */
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Плавний підйом при вході у в'юпорт */
export function FadeUp({
  children,
  delay = 0,
  y = 26,
  amount = 0.35,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  amount?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Рядок, що виїжджає з-під маски */
export function LineReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div className={className} style={{ overflow: "hidden" }}>
      <motion.div
        initial={reduced ? false : { y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Кінематографічна поява тексту: слово за словом, blur → фокус */
export function WordsIn({
  text,
  delay = 0,
  stagger = 0.055,
  className,
  as: Tag = "span",
}: {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const M = motion[Tag];
  return (
    <M
      className={className}
      initial={reduced ? undefined : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          style={{ display: "inline-block", whiteSpace: "pre" }}
          variants={{
            hidden: { opacity: 0, y: "0.5em", filter: "blur(10px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {w + (i < words.length - 1 ? " " : "")}
        </motion.span>
      ))}
    </M>
  );
}
