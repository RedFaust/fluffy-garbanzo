/**
 * Центральний конфіг сайту.
 * УВАГА: контакти — тимчасові заглушки, замінити перед запуском.
 * Telegram: створити бота через @BotFather, вставити token і chat_id.
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

  // ── Telegram-ліди (ЗАГЛУШКИ — замінити!) ──
  telegram: {
    botToken: "REPLACE_BOT_TOKEN", // від @BotFather, формат 123456:ABC-DEF...
    chatId: "REPLACE_CHAT_ID", // id чату/групи, куди падають заявки
  },

  film: { src: "/media/film-720.mp4", poster: "/media/film-poster.jpg" },
} as const;

export type DayTheme = "night" | "day";
