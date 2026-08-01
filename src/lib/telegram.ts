/**
 * Відправка заявки в Telegram через Bot API.
 * Налаштування: src/data/site.ts → telegram.botToken / chatId.
 *
 * ПРИМІТКА ПРО БЕЗПЕКУ: токен бота у клієнтському коді видимий.
 * Для цього лендінгу це усвідомлений компроміс: бот створюється ВИКЛЮЧНО
 * для прийому лідів (жодних прав адміністратора), а спам обмежує honeypot.
 * За бажання пізніше — перенести на Cloudflare Worker (10 хв роботи).
 */
import { site } from "../data/site";

export type Lead = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  interest: string;
  lang: string;
  /** honeypot — має бути порожнім */
  company?: string;
};

export async function sendLead(lead: Lead): Promise<boolean> {
  // honeypot: боти заповнюють приховане поле — мовчки "успіх"
  if (lead.company && lead.company.trim() !== "") return true;

  const { botToken, chatId } = site.telegram;
  if (!botToken || botToken.startsWith("REPLACE")) {
    console.warn("[telegram] Токен не налаштовано — заявка виведена в консоль:", lead);
    // у режимі-заглушці вважаємо успіхом, щоб UX можна було тестувати
    return true;
  }

  const text = [
    "🏡 <b>Нова заявка — Anwesen am Kolberg</b>",
    "",
    `👤 <b>${esc(lead.name)}</b>`,
    `✉️ ${esc(lead.email)}`,
    lead.phone ? `📞 ${esc(lead.phone)}` : null,
    `🎯 Інтерес: ${esc(lead.interest)}`,
    lead.message ? `💬 ${esc(lead.message)}` : null,
    "",
    `🌐 Мова: ${lead.lang} · ${new Date().toLocaleString("de-DE")}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
