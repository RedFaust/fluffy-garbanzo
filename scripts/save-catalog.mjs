import { readFileSync, writeFileSync } from "node:fs";
const raw = readFileSync(
  "C:/Users/Faust/AppData/Local/Temp/claude/D----------------/e5c98edc-acb0-469c-be55-f5e8525a7fa3/tasks/w1zgvh25y.output",
  "utf8"
);
const j = JSON.parse(raw);
const photos = j.result.photos.map((p) => ({
  ...p,
  file: p.file.replaceAll("\\", "/").split("/").pop(),
}));
writeFileSync("src/data/photo-catalog.json", JSON.stringify(photos, null, 2));
console.log("saved", photos.length, "entries");
console.log("HERO candidates:");
photos
  .filter((p) => p.use === "hero")
  .forEach((p) => console.log(" *", p.file, `(${p.hero_score})`, p.area, "—", p.shows.slice(0, 80)));
console.log("SECTION top:");
photos
  .filter((p) => p.use === "section" && p.hero_score >= 7)
  .forEach((p) => console.log(" *", p.file, `(${p.hero_score})`, p.area));
