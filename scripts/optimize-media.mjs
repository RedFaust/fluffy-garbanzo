/**
 * Медіа-пайплайн: конвертує фото вілли у responsive WebP + генерує blur-заглушки
 * та маніфест src/data/media-manifest.json.
 * Запуск: node scripts/optimize-media.mjs
 */
import sharp from "sharp";
import { readdir, mkdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SRC_DIR = "D:/Проекти/Матеріали/Bilder Bergstraße 22A – 2182";
const OUT_DIR = path.resolve("public/media");
const MANIFEST = path.resolve("src/data/media-manifest.json");

// Розміри для srcset. Плани поверхів — окремо (PNG з прозорістю → WebP lossless-ish).
const WIDTHS = [2000, 1280, 720];
const QUALITY = { 2000: 72, 1280: 74, 720: 76 };

function slugify(name) {
  return name
    .replace(/\.(jpe?g|png)$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .toLowerCase()
    .replace(/CAM03021G0-PR0086-STILL/i, "still-")
    .replace(/cam03021g0-pr0086-still/g, "still-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const files = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  const manifest = {};
  let done = 0;

  for (const file of files) {
    const slug = slugify(file);
    const srcPath = path.join(SRC_DIR, file);
    const img = sharp(srcPath, { failOn: "none" }).rotate(); // авто-орієнтація EXIF
    const meta = await img.metadata();
    const isPlan = /grundriss/i.test(file);

    const entry = {
      file,
      slug,
      width: meta.width,
      height: meta.height,
      aspect: +(meta.width / meta.height).toFixed(4),
      sizes: {},
      blur: "",
    };

    for (const w of WIDTHS) {
      if (meta.width < w && w !== 720) continue; // не апскейлимо
      const out = path.join(OUT_DIR, `${slug}-${w}.webp`);
      if (!existsSync(out)) {
        await sharp(srcPath, { failOn: "none" })
          .rotate()
          .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
          .webp({ quality: isPlan ? 88 : QUALITY[w], effort: 4 })
          .toFile(out);
      }
      const s = await stat(out);
      entry.sizes[w] = { path: `/media/${slug}-${w}.webp`, kb: Math.round(s.size / 1024) };
    }

    // Blur-заглушка: 24px webp → base64
    const blurBuf = await sharp(srcPath, { failOn: "none" })
      .rotate()
      .resize({ width: 24 })
      .webp({ quality: 40 })
      .toBuffer();
    entry.blur = `data:image/webp;base64,${blurBuf.toString("base64")}`;

    manifest[slug] = entry;
    done++;
    process.stdout.write(`\r${done}/${files.length} ${slug}                    `);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  const total = Object.values(manifest).reduce(
    (a, e) => a + Object.values(e.sizes).reduce((b, s) => b + s.kb, 0),
    0
  );
  console.log(`\nOK: ${done} фото → ${(total / 1024).toFixed(1)} MB загалом, маніфест записано.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
