/**
 * Спільна форма заявки (секція + модал): чипи інтересу, 4 поля,
 * honeypot, DSGVO-згода, стани надсилання → Telegram.
 */
import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send } from "lucide-react";
import { useT } from "../lib/i18n";
import { site } from "../data/site";
import { sendLead } from "../lib/telegram";

type Status = "idle" | "sending" | "ok" | "err";

export default function LeadForm({
  defaultInterest = "viewing",
  autoFocus = false,
}: {
  defaultInterest?: string;
  autoFocus?: boolean;
}) {
  const { t, lang } = useT();
  const [interest, setInterest] = useState(defaultInterest);
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);

  useEffect(() => setInterest(defaultInterest), [defaultInterest]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    const interestLabel =
      t.contact.interest.options.find((o) => o.id === interest)?.label ?? interest;

    setStatus("sending");
    const ok = await sendLead({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? "") || undefined,
      message: String(fd.get("message") ?? "") || undefined,
      company: String(fd.get("company") ?? ""),
      interest: interestLabel,
      lang,
    });
    setStatus(ok ? "ok" : "err");
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="form__interest" role="radiogroup" aria-label={t.contact.interest.label}>
        <span className="form__interest-label">{t.contact.interest.label}</span>
        {t.contact.interest.options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={interest === o.id}
            className={`form__chip ${interest === o.id ? "active" : ""}`}
            onClick={() => setInterest(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="form__field">
        <label htmlFor="f-name">{t.contact.fields.name} *</label>
        <input id="f-name" name="name" autoComplete="name" required minLength={2} autoFocus={autoFocus} />
      </div>
      <div className="form__row">
        <div className="form__field">
          <label htmlFor="f-email">{t.contact.fields.email} *</label>
          <input id="f-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="form__field">
          <label htmlFor="f-phone">{t.contact.fields.phone}</label>
          <input id="f-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="form__field">
        <label htmlFor="f-msg">{t.contact.fields.message}</label>
        <textarea id="f-msg" name="message" rows={3} />
      </div>

      {/* honeypot */}
      <div className="form__hp" aria-hidden="true">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="form__consent">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{t.contact.consent}</span>
      </label>

      <button className="btn btn--gold form__submit" type="submit" disabled={status === "sending"}>
        <Send size={16} aria-hidden="true" />
        {status === "sending" ? t.contact.sending : t.contact.submit}
      </button>

      <AnimatePresence>
        {status === "ok" && (
          <motion.p
            className="form__status form__status--ok"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
          >
            {t.contact.success}
          </motion.p>
        )}
        {status === "err" && (
          <motion.p
            className="form__status form__status--err"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
          >
            {t.contact.error}{" "}
            <a href={`mailto:${site.email}`} style={{ textDecoration: "underline" }}>
              {site.email}
            </a>
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
