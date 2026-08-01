/**
 * 3D-нахил сцени за позицією курсора (тільки pointer:fine, поважає reduced-motion).
 * Повертає spring-значення rotateX/rotateY у градусах.
 */
import { useEffect } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "motion/react";

export function useMouseTilt(maxDeg = 1.8) {
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 60, damping: 18, mass: 0.8 });
  const rotateY = useSpring(ry, { stiffness: 60, damping: 18, mass: 0.8 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
      const ny = e.clientY / window.innerHeight - 0.5;
      ry.set(nx * maxDeg * 2);
      rx.set(-ny * maxDeg * 2);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduced, rx, ry, maxDeg]);

  return { rotateX, rotateY };
}
