/**
 * Hero «кіно-відкриття»: шторки, наїзд камери, вхід у кадр при скролі.
 * Праворуч — анімована кнопка Play з підписом: відео-тур у лайтбоксі.
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Play, X } from "lucide-react";
import Img from "../Img";
import { WordsIn } from "../ux/Reveal";
import { useMouseTilt } from "../../lib/useMouseTilt";
import { useT } from "../../lib/i18n";
import { useContactModal } from "../../lib/contactModal";
import { site } from "../../data/site";

export default function Hero({ ready }: { ready: boolean }) {
  const { t } = useT();
  const { open } = useContactModal();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [filmOpen, setFilmOpen] = useState(false);
  const { rotateX, rotateY } = useMouseTilt(1.1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  /* ЖОДНОГО scale при скролі: анімований масштаб великого шару змушує
     Chromium пере-растеризовувати фото (джанк). Паралакс — тільки translate. */
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const mediaFade = useTransform(scrollYProgress, [0.55, 0.98], [1, 0]);
  const contentFade = useTransform(scrollYProgress, [0.15, 0.55], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-14%"]);

  const desktop =
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  /* лайтбокс: ESC + блокування скролу */
  useEffect(() => {
    if (!filmOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFilmOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [filmOpen]);

  return (
    <section className="hero" id="top" ref={ref}>
      {/* кіно-шторки */}
      <motion.div
        className="hero__bar hero__bar--top"
        initial={false}
        animate={ready ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 1.15, ease: [0.65, 0, 0.15, 1], delay: 0.1 }}
      />
      <motion.div
        className="hero__bar hero__bar--bottom"
        initial={false}
        animate={ready ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 1.15, ease: [0.65, 0, 0.15, 1], delay: 0.1 }}
      />

      {/* один анімований шар (скрол-масштаб + тілт разом) — всередині
          лише разова кен-бернз-поява, далі статичний шар. Менше
          повноекранних рухомих шарів = менше роботи композитора. */}
      <motion.div
        className="hero__media"
        style={
          reduced
            ? undefined
            : desktop
              ? { y: mediaY, opacity: mediaFade, rotateX, rotateY }
              : { y: mediaY, opacity: mediaFade }
        }
      >
        {/* разовий кен-бернз на вході; постійний запас масштабу 1.18
            покриває паралакс-зсув і тілт, далі шар статичний */}
        <motion.div
          style={{ width: "100%", height: "100%" }}
          initial={reduced ? false : { scale: 1.3 }}
          animate={ready ? { scale: 1.18 } : {}}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Img slug="still-010" alt="Anwesen am Kolberg — Villa mit Pool" sizes="100vw" eager />
        </motion.div>
      </motion.div>
      <div className="hero__veil" aria-hidden="true" />

      <motion.div
        className="hero__content container"
        style={reduced ? undefined : { opacity: contentFade, y: contentY }}
      >
        <motion.span
          className="kicker"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {t.hero.kicker}
        </motion.span>
        <h1 className="hero__title display display--hero" style={{ marginTop: "0.9rem" }}>
          {ready && (
            <>
              <WordsIn text={t.hero.titleA} delay={0.55} stagger={0.09} as="span" />
              <br />
              <span className="gold">
                <WordsIn text={t.hero.titleB} delay={0.85} stagger={0.09} as="span" />
              </span>
            </>
          )}
        </h1>
        <motion.p
          className="hero__sub lead"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.35 }}
        >
          {t.hero.sub}
        </motion.p>

        {/* Play: відео-тур — у композиції тексту */}
        <motion.div
          className="hero__filmrow"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <button className="hero__play" onClick={() => setFilmOpen(true)} aria-label={t.film.play}>
            <span className="hero__play-ring" aria-hidden="true" />
            <span className="hero__play-ring hero__play-ring--2" aria-hidden="true" />
            <Play size={20} strokeWidth={1.8} fill="currentColor" aria-hidden="true" />
          </button>
          <span className="hero__play-cap">
            <b>{t.film.play}</b>
            <i>{t.film.kicker} · 0:34</i>
          </span>
        </motion.div>

        <motion.div
          className="hero__row"
          initial={reduced ? false : { opacity: 0, y: 26 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.6 }}
        >
          <div className="hero__facts">
            <div className="hero__fact">
              <b>308 m²</b>
              <span>Wohnfläche</span>
            </div>
            <div className="hero__fact">
              <b>1.485 m²</b>
              <span>Grundstück</span>
            </div>
            <div className="hero__fact">
              <b>2022 · A</b>
              <span>Neubau · Energie</span>
            </div>
            <div className="hero__fact hero__fact--price">
              <b>{site.price}</b>
              <span>Kaufpreis</span>
            </div>
          </div>
          <div className="hero__ctas">
            <button className="btn btn--gold btn--xl" onClick={() => open("viewing")}>
              {t.nav.cta}
            </button>
          </div>
        </motion.div>
      </motion.div>

      <div className="hero__scroll" aria-hidden="true">
        <i />
        {t.hero.scroll}
      </div>

      {/* лайтбокс відео */}
      <AnimatePresence>
        {filmOpen && (
          <div className="vmodal" role="dialog" aria-modal="true" aria-label={t.film.kicker} data-lenis-prevent>
            <motion.div
              className="vmodal__scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setFilmOpen(false)}
            />
            <motion.div
              className="vmodal__frame"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <button className="vmodal__close" onClick={() => setFilmOpen(false)} aria-label={t.legal.close}>
                <X size={18} />
              </button>
              <video src={site.film.src} poster={site.film.poster} controls autoPlay playsInline />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
