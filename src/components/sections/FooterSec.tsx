/**
 * Футер: контакти маклера, правові посилання (Impressum / Datenschutz)
 * і застереження. Самі тексти живуть у спільній модалці <LegalModal />,
 * бо політику відкривають ще й із галочки згоди у формі.
 */
import { useT } from "../../lib/i18n";
import { useLegalModal } from "../../lib/legalModal";
import { site } from "../../data/site";

export default function FooterSec() {
  const { t } = useT();
  const { open } = useLegalModal();

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
            <button onClick={() => open("impressum")}>{t.footer.impressum}</button>
            <button onClick={() => open("datenschutz")}>{t.footer.datenschutz}</button>
          </div>
        </div>
        <div className="footer__note">
          <span>{t.footer.legalNote}</span>
          <span>
            © {new Date().getFullYear()} · {t.footer.rights}
          </span>
        </div>
      </div>
    </footer>
  );
}
