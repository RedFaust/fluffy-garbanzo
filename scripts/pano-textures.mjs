/** Генерує 2800px WebP-текстури для PanoTour (усі ракурси всіх кімнат). */
import sharp from "sharp";
import path from "node:path";
import { existsSync } from "node:fs";

const SRC = "D:/Проекти/Матеріали/Bilder Bergstraße 22A – 2182";
const OUT = path.resolve("public/media");

const FILES = {
  /* Vorhof */
  "still-012": "CAM03021G0-PR0086-STILL012.jpg",
  "bergstr22-0167": "Bergstr22_0167.jpg",
  "bergstr22-0214": "Bergstr22_0214.jpg",
  "still-014": "CAM03021G0-PR0086-STILL014.jpg",
  /* Wohnen */
  "bergstr22-0116": "Bergstr22_0116.jpg",
  "bergstr22-0119": "Bergstr22_0119.jpg",
  "bergstr22-0034": "Bergstr22_0034.jpg",
  /* Essen */
  "bergstr22-0124": "Bergstr22_0124.jpg",
  "bergstr22-0128": "Bergstr22_0128.jpg",
  "bergstr22-0131": "Bergstr22_0131.jpg",
  /* Küche */
  "bergstr22-0140": "Bergstr22_0140.jpg",
  /* Schlafen */
  "bergstr22-0062": "Bergstr22_0062.jpg",
  "bergstr22-0066": "Bergstr22_0066.jpg",
  "schlafzimmer-1-og": "Schlafzimmer 1 (OG).jpg",
  "schlafzimmer-2-visualisiert-og": "Schlafzimmer 2 visualisiert (OG).jpg",
  /* Bad */
  "bergstr22-0067": "Bergstr22_0067.jpg",
  "bergstr22-0069": "Bergstr22_0069.jpg",
  "bergstr22-0059": "Bergstr22_0059.jpg",
  "bergstr22-0061": "Bergstr22_0061.jpg",
  "bergstr22-0101": "Bergstr22_0101.jpg",
  "bergstr22-0075": "Bergstr22_0075.jpg",
  /* Atelier */
  "bergstr22-0026": "Bergstr22_0026.jpg",
  "bergstr22-0030": "Bergstr22_0030.jpg",
  "atelier-visualisiert-dg": "Atelier visualisiert (DG).jpg",
  /* ELW / Keller */
  "schlafzimmer-4-visualisiert-ug": "Schlafzimmer 4 visualisiert (UG).jpg",
  "bergstr22-0083": "Bergstr22_0083.jpg",
  "bergstr22-0086": "Bergstr22_0086.jpg",
  /* Garten & Pool */
  "still-010": "CAM03021G0-PR0086-STILL010.jpg",
  "still-034": "CAM03021G0-PR0086-STILL034.jpg",
  "still-020": "CAM03021G0-PR0086-STILL020.jpg",
  "still-024": "CAM03021G0-PR0086-STILL024.jpg",
  "still-028": "CAM03021G0-PR0086-STILL028.jpg",
  "bergstr22-0051": "Bergstr22_0051.jpg",
  /* Доповнення за каталогом */
  "bergstr22-0138": "Bergstr22_0138.jpg",
  "bergstr22-0147": "Bergstr22_0147.jpg",
  "bergstr22-0146": "Bergstr22_0146.jpg",
  "bergstr22-0144": "Bergstr22_0144.jpg",
  "bergstr22-0109": "Bergstr22_0109.jpg",
  "bergstr22-0107": "Bergstr22_0107.jpg",
  "still-011": "CAM03021G0-PR0086-STILL011.jpg",
  "still-018": "CAM03021G0-PR0086-STILL018.jpg",
  "still-019": "CAM03021G0-PR0086-STILL019.jpg",
  "bergstr22-0171": "Bergstr22_0171.jpg",
  "schlafzimmer-3-visualisiert-og": "Schlafzimmer 3 visualisiert (OG).png",
  "still-032-2": "CAM03021G0-PR0086-STILL032 (2).jpg",
  "still-040-kopie": "CAM03021G0-PR0086-STILL040 Kopie.JPG",
};

for (const [slug, file] of Object.entries(FILES)) {
  const out = path.join(OUT, `${slug}-2800.webp`);
  if (existsSync(out)) continue;
  await sharp(path.join(SRC, file), { failOn: "none" })
    .rotate()
    .resize({ width: 2800, withoutEnlargement: true })
    .webp({ quality: 74, effort: 4 })
    .toFile(out);
  console.log("OK", slug);
}
console.log("done");
