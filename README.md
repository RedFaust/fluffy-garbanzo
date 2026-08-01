# Anwesen am Kolberg — лендінг-румтур

Кінематографічний односторінковий лендінг для продажу вілли (Bergstraße 22A, Kolberg/Heidesee).
Структура: hero з фільмом → інтерактивний 3D-рум-тур (three.js, панорамні ракурси + плани
поверхів) → карта локації з реальними відстанями (OSRM) і Google-Maps-вкладкою (двоклікова
GDPR-згода) → пінований серпантинний Hausrundgang (12 станцій, тік колеса = слайд) →
емоційний фінал «Ein Jahr am Kolberg» → ціна + енергія (GEG) + форма заявок у Telegram.
DE/EN, кастомний курсор, Lenis. Third-party — лише Google Maps за явною згодою.

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # продакшн у dist/
```

## Перед публікацією — ОБОВ'ЯЗКОВО замінити

1. **Контакти** — `src/data/site.ts`: `phone`, `phoneHref`, `email` (зараз заглушки).
2. **Telegram-ліди** — `src/data/site.ts` → `telegram`:
   - створити бота через [@BotFather](https://t.me/BotFather) → отримати `botToken`;
   - додати бота в приватну групу/канал або написати йому і взяти `chatId`
     (можна дізнатись через `https://api.telegram.org/bot<TOKEN>/getUpdates`);
   - поки токен = `REPLACE_...`, форма працює в демо-режимі (заявка в консоль + «успіх»).
   - ⚠️ Токен видимий у клієнтському коді. Бот має бути ТІЛЬКИ для лідів. За бажання —
     перенести відправку на Cloudflare Worker (безкоштовно), щоб сховати токен.
3. **Impressum + Datenschutz** — `src/lib/i18n.tsx` → `legal` (зараз плейсхолдери).
   Для німецького сайту це юридично обов'язково.
4. **Ціна** — `src/data/site.ts` → `price` (зараз 1.097.826 € як в exposé).

## Медіа

- Фото конвертуються з `D:/Проекти/Матеріали/Bilder Bergstraße 22A – 2182/`:
  `node scripts/optimize-media.mjs` → `public/media/*.webp` + `src/data/media-manifest.json`.
- Відео стиснуто ffmpeg → `public/media/film-720.mp4` (13,5 МБ, вантажиться по кліку).

## Стек

Vite · React 19 · TypeScript · Motion (Framer) · Lenis · lucide-react · @fontsource (self-hosted, GDPR).

## Структура

- `src/lib/i18n.tsx` — усі тексти DE/EN (один файл — легко правити).
- `src/components/sections/*` — секції в порядку скролу.
- `src/components/sections/Tour.tsx` — глави туру: композиції (full/split/collage) + фото (LAYOUTS).
- `src/components/three/PanoTour.tsx` — інтерактивний рум-тур «роззирнись у кімнаті»:
  маршрут кімнат, хотспоти і точки мінімапи — у масиві ROOMS.
- `src/styles/global.css` — дизайн-токени (палітра, типографіка).

## Деплой

Статичний `dist/` — будь-який хостинг: Cloudflare Pages / Netlify / Vercel
(`npm run build`, publish dir `dist`). Домен-ідея: `villa-kolberg.de`.
