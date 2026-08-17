/**
 * Центральний конфіг сайту.
 * УВАГА: контакти — тимчасові заглушки, замінити перед запуском.
 */
export const site = {
  name: "Anwesen am Kolberg",
  address: "Kolberg · Gemeinde Heidesee · Brandenburg",

  // ── Ціна та факти ──
  price: "1.097.826 €",
  priceNote: { de: "zzgl. Käuferprovision 3,57 % inkl. MwSt.", en: "plus buyer's commission 3.57% incl. VAT" },

  // ── Контакти (ЗАГЛУШКИ — замінити!) ──
  phone: "+49 30 000 000 00",
  phoneHref: "tel:+49300000000",
  email: "kontakt@beispiel-immobilien.de",
  broker: "Aloha Living Immobilien GmbH",

  /* Telegram-ліди налаштовуються НЕ тут: токен бота живе у змінних
     оточення Netlify (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID) і читається
     лише в netlify/functions/lead.ts. У клієнтському конфізі він опинявся
     б у відкритому бандлі — тобто бот був би доступний будь-кому. */

  film: { src: "/media/film-720.mp4", poster: "/media/film-poster.jpg" },
} as const;

export type DayTheme = "night" | "day";
