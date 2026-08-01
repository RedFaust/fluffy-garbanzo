/** Обрізає грандріси: індивідуальний кроп під креслення кожного поверху. */
import sharp from "sharp";
import path from "node:path";

const SRC = "D:/Проекти/Матеріали/Bilder Bergstraße 22A – 2182";
const OUT = path.resolve("public/media");

/* Частки оригіналу [left, top, right, bottom] — щільно по кресленню */
const PLANS = {
  "plan-crop-kg": { file: "Grundriss (KG).png", box: [0.10, 0.02, 0.78, 0.96] },
  "plan-crop-eg": { file: "Grundriss (EG).png", box: [0.0, 0.08, 0.85, 0.92] },
  "plan-crop-og": { file: "Grundriss (OG).png", box: [0.02, 0.07, 0.82, 0.93] },
  "plan-crop-dg": { file: "Grundriss (DG).png", box: [0.0, 0.13, 0.85, 0.86] },
};

for (const [slug, { file, box }] of Object.entries(PLANS)) {
  const img = sharp(path.join(SRC, file));
  const m = await img.metadata();
  const [l, t, r, b] = box;
  await img
    .extract({
      left: Math.round(m.width * l),
      top: Math.round(m.height * t),
      width: Math.round(m.width * (r - l)),
      height: Math.round(m.height * (b - t)),
    })
    .resize({ width: 1600 })
    .webp({ quality: 88 })
    .toFile(path.join(OUT, `${slug}.webp`));
  console.log("OK", slug);
}
console.log("done");
