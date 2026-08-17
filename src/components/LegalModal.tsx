/**
 * Спільна модалка правових текстів (Impressum / Datenschutzerklärung).
 * Рендериться один раз на рівні застосунку, відкривається з футера
 * і з-під галочки згоди у формі заявки.
 */
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useT } from "../lib/i18n";
import { useLegalModal } from "../lib/legalModal";

export default function LegalModal() {
  const { doc, close } = useLegalModal();
  const { t } = useT();

  /* ESC + блокування скролу під модалкою */
  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [doc, close]);

  const title = doc === "impressum" ? t.legal.impressumTitle : t.legal.datenschutzTitle;
  const body = doc === "impressum" ? t.legal.impressumBody : t.legal.datenschutzBody;

  return (
    <AnimatePresence>
      {doc && (
        <div className="legal" role="dialog" aria-modal="true" aria-label={title} data-lenis-prevent>
          <motion.div
            className="legal__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            className="legal__card"
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98, transition: { duration: 0.18 } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3>{title}</h3>
            {body.map((sec, i) => (
              <section key={i} className="legal__sec">
                {sec.h && <h4>{sec.h}</h4>}
                {sec.p.map((p, k) => (
                  <p key={k}>{p}</p>
                ))}
              </section>
            ))}
            <button className="btn btn--ghost legal__close" onClick={close}>
              {t.legal.close}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
