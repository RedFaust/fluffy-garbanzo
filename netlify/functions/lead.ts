/**
 * Приймач заявок → Telegram.
 *
 * Токен бота живе ЛИШЕ тут, у змінних оточення Netlify, і ніколи не
 * потрапляє в браузерний бандл. Раніше він лежав у src/data/site.ts —
 * тобто був у відкритому JS, а це повний доступ до бота будь-кому:
 * читати переписку групи через getUpdates, писати від його імені,
 * видалити бота. Тепер клієнт бачить лише POST /.netlify/functions/lead.
 *
 * Змінні оточення (Netlify → Site configuration → Environment variables):
 *   TELEGRAM_BOT_TOKEN — від @BotFather
 *   TELEGRAM_CHAT_ID   — id групи/чату для заявок
 */

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  interest?: string;
  lang?: string;
  /** яка форма: секція чи модальне вікно */
  source?: string;
  /** шлях сторінки разом із якорем — Referer фрагмент не передає */
  page?: string;
  /** honeypot — у людей завжди порожній */
  company?: string;
};

/** Геодані дає сама Netlify (по IP на краю мережі) — без сторонніх сервісів */
type NetlifyGeo = {
  city?: string;
  country?: { code?: string; name?: string };
  subdivision?: { code?: string; name?: string };
};

const LIMITS = { name: 120, email: 160, phone: 60, message: 2000, interest: 120, page: 200 };

/* Примітивний тротлінг у памʼяті: живе, доки «теплий» контейнер.
   Не панацея, але зрізає найтупіший флуд однією адресою. */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function throttled(ip: string, now: number): boolean {
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) hits.clear(); // страховка від росту памʼяті
  return list.length > MAX_PER_WINDOW;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const trim = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/* Підписи в заявці — німецькою: повідомлення читає німецький маклер */
const LANGS: Record<string, string> = {
  de: "🇩🇪 Deutsch (DE)",
  en: "🇬🇧 English (EN)",
};

const SOURCES: Record<string, string> = {
  section: "Sektion „Kontakt“",
  modal: "Pop-up-Formular",
};

function device(ua: string): string {
  if (/iPad|Tablet/i.test(ua)) return "📱 <b>Gerät:</b> Tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "📱 <b>Gerät:</b> Mobil";
  return "🖥 <b>Gerät:</b> Desktop";
}

/* ISO-код країни → прапорець з regional indicator symbols */
function flag(cc: string): string {
  if (!/^[A-Za-z]{2}$/.test(cc)) return "";
  return String.fromCodePoint(
    ...[...cc.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

let regionNames: Intl.DisplayNames | null = null;
function countryDe(cc: string, fallback?: string): string {
  try {
    regionNames ??= new Intl.DisplayNames(["de"], { type: "region" });
    return regionNames.of(cc.toUpperCase()) ?? fallback ?? cc;
  } catch {
    return fallback ?? cc;
  }
}

/** Рядок «Herkunft» із геоданих Netlify (по IP, тому приблизно) */
function origin(geo: NetlifyGeo | undefined): string | null {
  const cc = geo?.country?.code;
  if (!cc) return null;
  const bits = [`${flag(cc)} ${countryDe(cc, geo?.country?.name)}`.trim()];
  const place = geo?.city || geo?.subdivision?.name;
  if (place) bits.push(esc(place));
  return `🌍 <b>Herkunft:</b> ${bits.join(" · ")}`;
}

function berlinTime(): string {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function buildMessage(
  lead: LeadPayload,
  ua: string,
  host: string,
  geo: NetlifyGeo | undefined
): string {
  const line = "━━━━━━━━━━━━━━━━━━";
  const parts: (string | null)[] = [
    "🏡 <b>Neue Anfrage — Anwesen am Kolberg</b>",
    line,
    `🎯 <b>Interesse:</b> ${esc(lead.interest || "—")}`,
    "",
    /* телефон тепер обов'язковий, тож іде першим; імʼя та e-mail
       показуємо лише коли їх справді залишили */
    `📞 <b>Telefon:</b> ${esc(lead.phone || "—")}`,
    lead.name ? `👤 <b>Name:</b> ${esc(lead.name)}` : null,
    lead.email ? `✉️ <b>E-Mail:</b> ${esc(lead.email)}` : null,
  ];

  if (lead.message) {
    parts.push("", "💬 <b>Nachricht</b>", `<blockquote>${esc(lead.message)}</blockquote>`);
  }

  parts.push(
    line,
    `🌐 <b>Sprachversion:</b> ${LANGS[lead.lang || ""] ?? esc(lead.lang || "—")}`,
    origin(geo),
    `📄 <b>Formular:</b> ${SOURCES[lead.source || ""] ?? esc(lead.source || "—")}`,
    `${device(ua)}`,
    lead.page ? `🔗 <b>Seite:</b> ${esc(host + lead.page)}` : null,
    `🕒 <b>Zeit:</b> ${berlinTime()} (Berlin)`
  );

  return parts.filter((p) => p !== null).join("\n");
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

/* Геодані приходять у context (Functions v2). Заголовок x-nf-geo —
   запасний шлях: він є завжди й не залежить від версії рантайму. */
function readGeo(req: Request, context?: { geo?: NetlifyGeo }): NetlifyGeo | undefined {
  if (context?.geo?.country?.code) return context.geo;
  const raw = req.headers.get("x-nf-geo");
  if (!raw) return undefined;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as NetlifyGeo;
  } catch {
    return undefined;
  }
}

/* Основні імена змінних плюс кілька поширених варіантів написання:
   через одну літеру в назві заявки мовчки не доходили б. */
const pick = (...names: string[]) => {
  for (const n of names) {
    const v = process.env[n]?.trim();
    if (v) return v;
  }
  return "";
};

/** Імена наявних змінних, схожих на телеграмні — лише у приватний лог */
const suspects = () =>
  Object.keys(process.env).filter((k) => /telegram|bot|chat/i.test(k));

export default async (req: Request, context?: { geo?: NetlifyGeo }): Promise<Response> => {
  const token = pick("TELEGRAM_BOT_TOKEN", "TELEGRAM_TOKEN", "BOT_TOKEN");
  const chatId = pick("TELEGRAM_CHAT_ID", "TELEGRAM_CHAT", "CHAT_ID");

  /* GET віддає стан налаштування — щоб перевірити деплой, не надсилаючи
     нічого в групу. Самих значень не показуємо, лише факт наявності. */
  if (req.method !== "POST") {
    return json(
      {
        ok: false,
        error: "method_not_allowed",
        configured: !!(token && chatId),
        hasToken: !!token,
        hasChatId: !!chatId,
      },
      405
    );
  }

  if (!token || !chatId) {
    console.error(
      `[lead] не задано: ${!token ? "TELEGRAM_BOT_TOKEN " : ""}${!chatId ? "TELEGRAM_CHAT_ID" : ""}`.trim() +
        ". Netlify → Site configuration → Environment variables; у Scopes має бути позначено Functions, " +
        "у Deploy contexts — All. Схожі наявні змінні: " +
        (suspects().join(", ") || "жодної")
    );
    return json({ ok: false, error: "not_configured" }, 500);
  }

  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  // honeypot: бот заповнив приховане поле — тихо вдаємо успіх
  if (trim(body.company, 200) !== "") return json({ ok: true });

  const lead: LeadPayload = {
    name: trim(body.name, LIMITS.name),
    email: trim(body.email, LIMITS.email),
    phone: trim(body.phone, LIMITS.phone),
    message: trim(body.message, LIMITS.message),
    interest: trim(body.interest, LIMITS.interest),
    lang: trim(body.lang, 8).toLowerCase(),
    source: trim(body.source, 24),
    page: trim(body.page, LIMITS.page),
  };

  /* Обов'язковий лише телефон — маклер передзвонює. Решта полів
     необов'язкові, але якщо e-mail вказали — перевіряємо формат. */
  const digits = (lead.phone ?? "").replace(/\D/g, "");
  if (digits.length < 6) return json({ ok: false, error: "phone" }, 400);
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email))
    return json({ ok: false, error: "email" }, 400);

  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";
  if (throttled(ip, Date.now())) return json({ ok: false, error: "rate_limited" }, 429);

  const ua = req.headers.get("user-agent") ?? "";
  let host = "";
  try {
    host = new URL(req.headers.get("referer") ?? "").origin;
  } catch {
    /* без Referer — покажемо лише шлях */
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(lead, ua, host, readGeo(req, context)),
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
    });
    if (!res.ok) {
      console.error("[lead] Telegram відмовив:", res.status, await res.text());
      return json({ ok: false, error: "telegram" }, 502);
    }
    return json({ ok: true });
  } catch (e) {
    console.error("[lead] мережева помилка:", e);
    return json({ ok: false, error: "network" }, 502);
  }
};
