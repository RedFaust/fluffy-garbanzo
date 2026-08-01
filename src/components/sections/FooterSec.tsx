/**
 * Футер + модалки Impressum / Datenschutz (тексти-плейсхолдери у словнику).
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useT } from "../../lib/i18n";
import { site } from "../../data/site";

export default function FooterSec() {
  const { t } = useT();
  const [modal, setModal] = useState<null | "impressum" | "datenschutz">(null);

  const title = modal === "impressum" ? t.legal.impressumTitle : t.legal.datenschutzTitle;
  const body = modal === "impressum" ? t.legal.impressumBody : t.legal.datenschutzBody;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              Anwesen <em style={{ fontStyle: "normal", color: "var(--gold)" }}>am Kolberg</em>
            </div>
            <p className="footer__broker">
              {t.footer.broker}: {site.broker}
              <br />
              {site.phone} · {site.email}
            </p>
          </div>
          <div className="footer__links">
            <button onClick={() => setModal("impressum")}>{t.footer.impressum}</button>
            <button onClick={() => setModal("datenschutz")}>{t.footer.datenschutz}</button>
          </div>
        </div>
        <div className="footer__note">
          <span>{t.footer.legalNote}</span>
          <span>
            © {new Date().getFullYear()} · {t.footer.rights}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <div className="legal" role="dialog" aria-modal="true" aria-label={title}>
            <motion.div
              className="legal__scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
            />
            <motion.div
              className="legal__card"
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98, transition: { duration: 0.18 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3>{title}</h3>
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <button className="btn btn--ghost legal__close" onClick={() => setModal(null)}>
                {t.legal.close}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
