/**
 * Фото POI для гео-блока: завантажує оригінали з Wikimedia Commons
 * (маніфест JSON: [{id, url}]) і конвертує в WebP 720×450 (cover, q72)
 * → public/media/geo/{id}.webp
 *
 * Використання: node scripts/geo-images.mjs <шлях-до-manifest.json>
 */
import { mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const manifestPath = process.argv[2];
if (!manifestPath) {
  console.error("Потрібен шлях до manifest.json [outdir=public/media/geo] [WxH=720x450]");
  process.exit(1);
}

const OUT = path.resolve(process.argv[3] || "public/media/geo");
const [OW, OH] = (process.argv[4] || "720x450").split("x").map(Number);
await mkdir(OUT, { recursive: true });

const items = JSON.parse(await readFile(manifestPath, "utf8"));
const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const { id, url } of items) {
  const out = path.join(OUT, `${id}.webp`);
  if (existsSync(out)) {
    results.push({ id, ok: true, skipped: true });
    continue;
  }
  try {
    let buf = null;
    for (let attempt = 1; attempt <= 4; attempt++) {
      const res = await fetch(url, {
        headers: { "User-Agent": "kolberg-landing/1.0 (image pipeline; one-time fetch)" },
        redirect: "follow",
      });
      if (res.status === 429) {
        await sleep(12000 * attempt); // rate limit Commons — чекаємо і повторюємо
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      buf = Buffer.from(await res.arrayBuffer());
      break;
    }
    if (!buf) throw new Error("HTTP 429 після ретраїв");
    const info = await sharp(buf)
      .resize(OW, OH, { fit: "cover", position: "attention" })
      .webp({ quality: 72 })
      .toFile(out);
    results.push({ id, ok: true, kb: Math.round(info.size / 1024) });
  } catch (e) {
    results.push({ id, ok: false, err: String(e.message || e) });
  }
  await sleep(3500); // пауза між файлами, щоб не ловити 429
}

console.log(JSON.stringify(results, null, 2));
const bad = results.filter((r) => !r.ok);
if (bad.length) process.exitCode = 2;
