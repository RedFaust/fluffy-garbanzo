/**
 * Спливаюча форма заявки: десктоп — центрований діалог,
 * мобільний — bottom-sheet. ESC / скрім / хрестик закривають.
 */
import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, Phone, Mail } from "lucide-react";
import LeadForm from "./LeadForm";
import { useContactModal } from "../lib/contactModal";
import { useT } from "../lib/i18n";
import { site } from "../data/site";

export default function ContactModal() {
  const { state, close } = useContactModal();
  const { t } = useT();
  const reduced = useReducedMotion();

  /* ESC + блокування скролу сторінки */
  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [state.open, close]);

  return (
    <AnimatePresence>
      {state.open && (
        <div className="cmodal" role="dialog" aria-modal="true" aria-label={t.contactModal.title} data-lenis-prevent>
          <motion.div
            className="cmodal__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          />
          <motion.div
            className="cmodal__card"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 32, scale: 0.98, transition: { duration: 0.18 } }
            }
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <button className="cmodal__close" onClick={close} aria-label={t.legal.close}>
              <X size={18} />
            </button>
            <span className="kicker">{t.contact.kicker}</span>
            <h3 className="cmodal__title display">{t.contactModal.title}</h3>
            <p className="cmodal__text">{t.contactModal.text}</p>

            <LeadForm defaultInterest={state.interest} autoFocus source="modal" />

            <div className="cmodal__direct">
              <a href={site.phoneHref}>
                <Phone size={15} aria-hidden="true" /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`}>
                <Mail size={15} aria-hidden="true" /> {site.email}
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
