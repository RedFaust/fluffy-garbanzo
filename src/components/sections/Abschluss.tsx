/**
 * Фінальний блок: сильний заклик до дії + ціна + обов'язкові
 * енергетичні дані (GEG) + пряма комунікація + форма заявки —
 * все в одному атмосферному екрані з розмитим фасадом у тлі.
 */
import { Phone, Mail, ArrowDownRight } from "lucide-react";
import Img from "../Img";
import { FadeUp } from "../ux/Reveal";
import LeadForm from "../LeadForm";
import { useT } from "../../lib/i18n";
import { site } from "../../data/site";

export default function Abschluss() {
  const { t, lang } = useT();

  return (
    <section className="fin" id="contact">
      {/* атмосфера: фасад, сильний блюр, темні вуалі, золоте дихання */}
      <div className="fin__bg" aria-hidden="true">
        <Img slug="still-010" alt="" sizes="100vw" />
      </div>
      <div className="fin__veil" aria-hidden="true" />
      <div className="fin__glow" aria-hidden="true" />

      <div className="container fin__inner">
        <div className="fin__head">
          <FadeUp>
            <span className="kicker">{t.finale.kicker}</span>
            <h2 className="fin__title display">{t.finale.title}</h2>
            <p className="fin__lead lead">{t.finale.lead}</p>
          </FadeUp>
        </div>

        <div className="fin__grid">
          <div className="fin__info">
            <FadeUp amount={0.3}>
              <div className="fin__price">
                <span className="kicker" style={{ color: "var(--muted-2)" }}>
                  {t.price.priceLabel}
                </span>
                <div className="price__value">{site.price}</div>
                <p className="price__note">{site.priceNote[lang]}</p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1} amount={0.25}>
              <div className="energy">
                <div className="energy__head">
                  <span className="energy__title">{t.price.energyTitle}</span>
                  <span className="energy__badge" aria-label="Energieeffizienzklasse A">
                    A
                  </span>
                </div>
                <table>
                  <tbody>
                    {t.price.energyRows.map(([k, v]) => (
                      <tr key={k}>
                        <td>{k}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeUp>

            <FadeUp delay={0.16} amount={0.25}>
              <div className="contact__direct">
                <span className="kicker" style={{ color: "var(--muted-2)" }}>
                  {t.contact.or}
                </span>
                <a href={site.phoneHref}>
                  <Phone aria-hidden="true" /> {site.phone}
                </a>
                <a href={`mailto:${site.email}`}>
                  <Mail aria-hidden="true" /> {site.email}
                </a>
              </div>
            </FadeUp>

            <FadeUp delay={0.2} amount={0.25}>
              <p className="price__legal">{t.price.note}</p>
            </FadeUp>
          </div>

          <FadeUp delay={0.12} amount={0.15} className="fin__formwrap">
            <span className="fin__formcue" aria-hidden="true">
              {t.finale.formCue}
              <ArrowDownRight size={14} />
            </span>
            <LeadForm />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
