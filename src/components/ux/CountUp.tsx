/**
 * Число, що «докручується» при появі у в'юпорті.
 */
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "motion/react";

export default function CountUp({
  value,
  suffix = "",
  prefix = "",
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 42, damping: 18 });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    if (reduced) {
      if (ref.current) ref.current.textContent = `${prefix}${fmt(value)}${suffix}`;
      return;
    }
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${prefix}${fmt(Math.round(v))}${suffix}`;
    });
    return unsub;
  }, [spring, prefix, suffix, reduced, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {reduced ? fmt(value) : 0}
      {suffix}
    </span>
  );
}

function fmt(n: number) {
  return n.toLocaleString("de-DE");
}
