/**
 * Відправка заявки: клієнт стукає у власну serverless-функцію, а вже
 * вона говорить із Telegram. Токен бота у браузер не потрапляє —
 * див. netlify/functions/lead.ts.
 */

export type Lead = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  interest: string;
  lang: string;
  /** яка саме форма: "section" | "modal" */
  source: string;
  /** honeypot — має бути порожнім */
  company?: string;
};

const ENDPOINT = "/.netlify/functions/lead";

export async function sendLead(lead: Lead): Promise<boolean> {
  // honeypot: боти заповнюють приховане поле — мовчки «успіх»
  if (lead.company && lead.company.trim() !== "") return true;

  const payload = {
    ...lead,
    /* Referer не передає якір, тож шлях зі #hash шлемо самі */
    page: typeof location !== "undefined" ? location.pathname + location.hash : "",
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    /* Локальний `vite dev` функцій не піднімає (для них потрібен
       `netlify dev`). Щоб не блокувати перевірку UX — пишемо заявку
       в консоль і вважаємо успіхом. У проді це не спрацює: там 404
       на цей шлях означав би зламаний деплой. */
    if (res.status === 404 && import.meta.env.DEV) {
      console.info("[lead] функція недоступна в dev — заявка:", payload);
      return true;
    }

    if (!res.ok) {
      console.warn("[lead] помилка відправки:", res.status);
      return false;
    }
    const data = (await res.json()) as { ok?: boolean };
    return data.ok === true;
  } catch (e) {
    console.warn("[lead] мережева помилка:", e);
    return false;
  }
}
