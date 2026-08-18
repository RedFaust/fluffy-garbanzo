/**
 * Hausrundgang: 12 слайдів у сітці 4×3, серпантинний шлях камери
 * право → вниз → вліво → вниз → право. Тексти — в i18n (t.haus.slides,
 * той самий порядок індексів).
 */

export type HausVariant = "title" | "split" | "duo" | "cover" | "specs" | "finale";

export interface HausFeature {
  icon: string;
  de: string;
  en: string;
}

export interface HausSlide {
  id: string;
  variant: HausVariant;
  /** дзеркальна композиція (фото праворуч) */
  mirror?: boolean;
  /** акцентний колір теми кімнати */
  accent: string;
  main?: string;
  /** галерея головного фото (перемикається мініатюрами); main = фолбек */
  photos?: string[];
  second?: string;
  /** object-position головного фото */
  origin?: string;
  /** пункти-переваги кімнати з іконками */
  features?: HausFeature[];
}

export const HAUS_SLIDES: HausSlide[] = [
  { id: "titel", variant: "title", accent: "#dfc28a", main: "be796373-deb2-4bff-8995-13dd0672e001" },
  {
    id: "vorhof", variant: "duo", accent: "#cbb08a",
    main: "still-012", photos: ["still-012", "bergstr22-0167", "still-018", "bergstr22-0214", "still-011"],
    origin: "50% 58%",
    features: [
      { icon: "gem", de: "Granit & Marmor im Vorhof", en: "Granite & marble forecourt" },
      { icon: "door", de: "Elektrisches Doppeltor", en: "Electric double gate" },
      { icon: "car", de: "Beheizte Doppelgarage", en: "Heated double garage" },
    ],
  },
  {
    id: "wohnen", variant: "split", accent: "#dfc28a",
    main: "bergstr22-0116", photos: ["bergstr22-0116", "bergstr22-0119", "bergstr22-0109", "bergstr22-0107"],
    features: [
      { icon: "sparkles", de: "Sternenhimmel-Decke, dimmbar", en: "Dimmable starry-sky ceiling" },
      { icon: "flame", de: "Kamin für lange Abende", en: "Fireplace for long evenings" },
      { icon: "paint", de: "Venezianischer Putz", en: "Venetian plaster walls" },
    ],
  },
  {
    id: "kueche", variant: "split", mirror: true, accent: "#d8a06a",
    main: "bergstr22-0140", photos: ["bergstr22-0140", "bergstr22-0124", "bergstr22-0147", "bergstr22-0144", "bergstr22-0138"],
    features: [
      { icon: "gem", de: "Dekton-Arbeitsplatte", en: "Dekton worktop" },
      { icon: "zap", de: "Quooker — kochendes Wasser", en: "Quooker boiling-water tap" },
      { icon: "chef", de: "Dampfbackofen & Markengeräte", en: "Steam oven & brand appliances" },
    ],
  },
  {
    id: "schlafen", variant: "duo", mirror: true, accent: "#d9bfae",
    main: "bergstr22-0062", photos: ["bergstr22-0062", "bergstr22-0066", "schlafzimmer-1-og", "bergstr22-0034", "schlafzimmer-2-visualisiert-og"],
    features: [
      { icon: "bed", de: "Drei Schlafzimmer, 22–24 m²", en: "Three bedrooms, 22–24 m²" },
      { icon: "trees", de: "Balkone ins Grüne", en: "Balconies into the green" },
      { icon: "moon", de: "Absolute Ruhe zur Waldseite", en: "Absolute quiet, forest side" },
    ],
  },
  {
    id: "bad", variant: "split", accent: "#9fc6cf",
    main: "bergstr22-0067", photos: ["bergstr22-0067", "bergstr22-0101", "bergstr22-0069", "bergstr22-0075", "bergstr22-0061"],
    features: [
      { icon: "bath", de: "Wellness-Doppelwanne", en: "Wellness bath for two" },
      { icon: "shower", de: "Walk-in-Duschen", en: "Walk-in showers" },
      { icon: "gem", de: "Onyx & Marmor", en: "Onyx & marble" },
    ],
  },
  {
    id: "atelier", variant: "duo", accent: "#d3a878",
    main: "bergstr22-0026", photos: ["bergstr22-0026", "atelier-visualisiert-dg", "bergstr22-0030"],
    features: [
      { icon: "sun", de: "Oberlichter im Dach", en: "Roof skylights" },
      { icon: "palette", de: "Boden in Farbverläufen gegossen", en: "Poured gradient floor" },
      { icon: "max", de: "Offener Dachstuhl, sichtbare Balken", en: "Open roof truss, exposed beams" },
    ],
  },
  {
    id: "fitness", variant: "split", mirror: true, accent: "#aab6c8",
    main: "bergstr22-0086", photos: ["bergstr22-0086", "bergstr22-0083"],
    features: [
      { icon: "dumbbell", de: "Kraftrahmen & Hantelbank", en: "Power rack & bench" },
      { icon: "pulse", de: "Spiegelwand, Gummiboden", en: "Mirror wall, rubber floor" },
      { icon: "timer", de: "Zwei Treppen statt Anfahrt", en: "Two flights instead of a drive" },
    ],
  },
  {
    id: "elw", variant: "split", accent: "#b3c4a6",
    main: "schlafzimmer-4-visualisiert-ug", photos: ["schlafzimmer-4-visualisiert-ug", "bergstr22-0076"],
    features: [
      { icon: "dooropen", de: "Separater Eingang von außen", en: "Separate outside entrance" },
      { icon: "bath", de: "Eigenes Bad & Küchenanschluss", en: "Own bath & kitchen hook-up" },
      { icon: "euro", de: "Vermietbar — laufende Einnahmen", en: "Rentable — recurring income" },
    ],
  },
  {
    id: "garten", variant: "cover", accent: "#8fd0c8",
    main: "still-034", photos: ["still-034", "still-020", "still-019", "still-032-2"],
    second: "still-040-kopie", origin: "48% 52%",
    features: [
      { icon: "waves", de: "Salzwasserpool, beheizt", en: "Heated saltwater pool" },
      { icon: "wind", de: "Gegenstromanlage & Massagedüsen", en: "Counter-current & massage jets" },
      { icon: "sun", de: "Drei Terrassen · über 90 m²", en: "Three terraces · over 90 m²" },
      { icon: "flame", de: "Feuerstelle am Abend", en: "Fire pit in the evening" },
    ],
  },
  { id: "substanz", variant: "specs", accent: "#dfc28a", main: "be796373-deb2-4bff-8995-13dd0672e001" },
  { id: "finale", variant: "finale", accent: "#dfc28a", main: "still-010", origin: "50% 56%" },
];

export const HAUS_COLS = 4;
export const HAUS_ROWS = Math.ceil(HAUS_SLIDES.length / HAUS_COLS);

/** позиція слайда в сітці (серпантин) */
export function hausCell(i: number) {
  const row = Math.floor(i / HAUS_COLS);
  const col = row % 2 === 0 ? i % HAUS_COLS : HAUS_COLS - 1 - (i % HAUS_COLS);
  return { col, row };
}
