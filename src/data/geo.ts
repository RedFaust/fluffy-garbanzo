/**
 * Гео-дані блока «Lage»: реальні координати POI навколо Bergstraße 22A
 * (Kolberg, Heidesee) + стилізована картографія (озера, автобани, Берлін).
 * Дані: гео-дослідження 08/2026 — координати OSM/Nominatim, маршрути OSRM,
 * розклади NEB/VBB, badestellen.brandenburg.de. Час — авто, якщо не пішки.
 */

export type PoiCat = "water" | "commute" | "daily" | "leisure";
export type PoiMode = "car" | "foot" | "bike";

export interface Poi {
  id: string;
  cat: PoiCat;
  icon: string;
  lat: number;
  lon: number;
  km: number;
  min: number;
  mode: PoiMode;
  /** якір: підпис завжди видно на карті */
  anchor?: boolean;
  /** візуальний зсув точки на карті (px SVG) — розводить щільні кластери */
  dx?: number;
  dy?: number;
  /** фото об'єкта (WebP 720×450 у public/media/geo/) + атрибуція ліцензії */
  img?: { src: string; credit: string };
  /** маршрут ПО ДОРОГАХ: вейпойнти в SVG-координатах (без будинку-старту),
      останній = позиція точки; без route — коротка пряма */
  route?: [number, number][];
  name: { de: string; en: string };
  desc: { de: string; en: string };
}

/* ── Проєкція: lat/lon → SVG (еквідистантна, майже ізотропна) ──── */
export const PROJ = { lonMin: 13.28, lonMax: 14.16, latMin: 52.02, latMax: 52.56, W: 780, H: 760 };

export function project(lat: number, lon: number) {
  return {
    x: Math.round(((lon - PROJ.lonMin) / (PROJ.lonMax - PROJ.lonMin)) * PROJ.W),
    y: Math.round(((PROJ.latMax - lat) / (PROJ.latMax - PROJ.latMin)) * PROJ.H),
  };
}

/* ── Будинок: Bergstraße 22A, Kolberger Ablage ─────────────────── */
export const HOUSE = { lat: 52.2382, lon: 13.8094 };

/* ── POI (порядок = порядок авто-циклу; вода перша — емоція) ───── */
export const POIS: Poi[] = [
  /* See & Natur */
  {
    id: "badestelle",
    cat: "water",
    icon: "waves",
    lat: 52.2474,
    lon: 13.8052,
    km: 1,
    min: 13,
    mode: "foot",
    img: { src: "/media/geo/badestelle.webp", credit: "Foto: Lienhard Schulz · CC BY-SA 3.0 (Wikimedia)" },
    route: [[466, 447], [465, 440]],
    name: { de: "Naturbadestelle Wolziger See", en: "Lake Wolzig bathing spot" },
    desc: {
      de: "Sandstrand, Liegewiese, amtlich überwachte Wasserqualität: der größte See des Naturparks (5,5 km²) liegt einen Spaziergang entfernt. Morgens schwimmen, ohne das Auto zu bewegen.",
      en: "Sandy beach, sunbathing lawn, officially monitored water quality: the nature park's largest lake (5.5 km²) is a stroll away. A morning swim without ever starting the car.",
    },
  },
  {
    id: "langersee",
    cat: "water",
    icon: "ship",
    lat: 52.242,
    lon: 13.7873,
    km: 1.2,
    min: 15,
    mode: "foot",
    img: { src: "/media/geo/langersee.webp", credit: "Foto: Hedwig Storch · CC BY-SA 4.0 (Wikimedia)" },
    route: [[459, 451], [450, 448]],
    name: { de: "Langer See & Dahme", en: "Langer See & Dahme" },
    desc: {
      de: "Die Villa liegt auf der Landenge zwischen zwei Seen. Über den Langen See und die Dahme führt der Wasserweg bis nach Berlin — mit dem eigenen Boot bis Köpenick.",
      en: "The villa sits on the isthmus between two lakes. Via Langer See and the River Dahme the waterway leads all the way to Berlin — take your own boat to Köpenick.",
    },
  },
  {
    id: "blossin",
    cat: "water",
    icon: "sail",
    lat: 52.2597,
    lon: 13.806,
    km: 3.7,
    min: 6,
    mode: "car",
    img: { src: "/media/geo/blossin.webp", credit: "Foto: Lienhard Schulz · CC BY-SA 3.0 (Wikimedia)" },
    route: [[464, 438], [466, 423]],
    name: { de: "Wassersportzentrum Blossin", en: "Blossin water-sports centre" },
    desc: {
      de: "Eines der größten Wassersportzentren Brandenburgs, am selben See: Segelschule, Windsurfen, SUP und Marina. Segelkurse für die Kinder, Liegeplatz fürs Boot.",
      en: "One of Brandenburg's largest water-sports centres, on the same lake: sailing school, windsurfing, SUP and a marina. Lessons for the kids, a berth for the boat.",
    },
  },
  {
    id: "naturpark",
    cat: "water",
    icon: "forest",
    lat: 52.2225,
    lon: 13.7671,
    km: 4.2,
    min: 5,
    mode: "car",
    img: { src: "/media/geo/naturpark.webp", credit: "Foto: Jochen Teufel · CC BY-SA 3.0 (Wikimedia)" },
    route: [[455, 462], [440, 470], [432, 475]],
    name: { de: "Naturpark Dahme-Heideseen", en: "Dahme-Heideseen nature park" },
    desc: {
      de: "594 km² Wald und über 100 Seen als geschützte Kulisse — das Anwesen steht mitten darin. Der 66-Seen-Wanderweg und der Rundweg um den Wolziger See beginnen praktisch vor der Tür.",
      en: "594 km² of forest and more than 100 lakes as a protected backdrop — the estate stands right inside it. The 66-Lakes Trail and the lake loop start practically at the door.",
    },
  },

  /* Anbindung */
  {
    id: "a12",
    cat: "commute",
    icon: "car",
    lat: 52.31966,
    lon: 13.78107,
    km: 10,
    min: 12,
    mode: "car",
    img: { src: "/media/geo/a12.webp", credit: "Foto: Felouch Kotek · CC BY-SA 4.0 (Wikimedia)" },
    route: [[463, 452], [428, 408], [452, 374], [444, 338]],
    name: { de: "A12 · Anschluss Friedersdorf", en: "A12 · Friedersdorf ramp" },
    desc: {
      de: "Von der Anschlussstelle Friedersdorf in fünf Minuten auf den Berliner Ring (A10) — oder ostwärts Richtung Frankfurt (Oder). Schnell weg, ohne Durchgangsverkehr im Dorf.",
      en: "From the Friedersdorf ramp it's five minutes to the Berlin ring (A10) — or east towards Frankfurt (Oder). Quick to leave, with no through-traffic in the village.",
    },
  },
  {
    id: "storkow",
    cat: "commute",
    icon: "train",
    lat: 52.25182,
    lon: 13.92096,
    km: 8.8,
    min: 11,
    mode: "car",
    anchor: true,
    img: { src: "/media/geo/storkow.webp", credit: "Foto: Lienhard Schulz · CC BY-SA 3.0 (Wikimedia)" },
    route: [[478, 432], [498, 411], [540, 424], [573, 433]],
    name: { de: "Bahnhof Storkow (RB36)", en: "Storkow station (RB36)" },
    desc: {
      de: "Die RB36 fährt stündlich nach Königs Wusterhausen mit Anschluss an S-Bahn und Regionalexpress nach Berlin — pendeln aus der Seenlandschaft, ganz ohne Stau.",
      en: "The RB36 runs hourly to Königs Wusterhausen, connecting to the S-Bahn and regional express into Berlin — commuting from the lake district without any traffic.",
    },
  },
  {
    id: "kw",
    cat: "commute",
    icon: "tram",
    lat: 52.2967,
    lon: 13.63153,
    km: 19.5,
    min: 23,
    mode: "car",
    img: { src: "/media/geo/kw.webp", credit: "Foto: V.Boldychev · CC BY-SA 4.0 (Wikimedia)" },
    route: [[463, 452], [428, 408], [380, 395], [340, 382], [311, 371]],
    name: { de: "Bf. Königs Wusterhausen", en: "Königs Wusterhausen station" },
    desc: {
      de: "RE2 und S46 bringen Sie in rund 30 Minuten nach Berlin; der neue RE20 fährt direkt zum BER und zum Hauptbahnhof. Und Bus 723 hält dafür mitten in Kolberg.",
      en: "The RE2 and S46 reach Berlin in around 30 minutes; the new RE20 runs directly to BER and the central station. Bus 723 stops right in Kolberg to get you there.",
    },
  },
  {
    id: "tesla",
    cat: "commute",
    icon: "factory",
    lat: 52.3972,
    lon: 13.79483,
    km: 23.8,
    min: 26,
    mode: "car",
    anchor: true,
    img: { src: "/media/geo/tesla.webp", credit: "Foto: Ot · CC BY 4.0 (Wikimedia)" },
    route: [[463, 452], [428, 408], [452, 374], [444, 338], [421, 277], [450, 264], [455, 228]],
    name: { de: "Tesla Gigafactory", en: "Tesla Gigafactory" },
    desc: {
      de: "Einer der größten Arbeitgeber Brandenburgs — über 11.000 Arbeitsplätze — liegt 26 Minuten entfernt. Das sichert Nachfrage und Wertentwicklung, während Kolberg still bleibt.",
      en: "One of Brandenburg's largest employers — over 11,000 jobs — is 26 minutes away. That secures demand and value growth, while Kolberg itself stays quiet.",
    },
  },
  {
    id: "ber",
    cat: "commute",
    icon: "plane",
    lat: 52.36486,
    lon: 13.51228,
    km: 36.8,
    min: 35,
    mode: "car",
    anchor: true,
    img: { src: "/media/geo/ber.webp", credit: "Foto: Antony-22 · CC BY-SA 4.0 (Wikimedia)" },
    route: [[463, 452], [428, 408], [452, 374], [444, 338], [421, 277], [340, 300], [261, 297], [206, 275]],
    name: { de: "Flughafen BER", en: "BER airport" },
    desc: {
      de: "Über A12 und Berliner Ring zum Hauptstadtflughafen — ideal für Vielflieger und internationale Gäste. Und über dem See ist nie ein Flugzeug zu hören.",
      en: "Via the A12 and the Berlin ring to the capital's airport — ideal for frequent flyers and international guests. And you'll never hear a plane over the lake.",
    },
  },
  {
    id: "berlin",
    cat: "commute",
    icon: "landmark",
    lat: 52.5219,
    lon: 13.4132,
    km: 54.5,
    min: 55,
    mode: "car",
    img: { src: "/media/geo/berlin.webp", credit: "Foto: dronepicr · CC BY 2.0 (Wikimedia)" },
    route: [[463, 452], [428, 408], [452, 374], [444, 338], [421, 277], [340, 300], [261, 297], [230, 230], [180, 140], [118, 54]],
    name: { de: "Berlin-Mitte", en: "Berlin Mitte" },
    desc: {
      de: "Kultur, Restaurants, Geschäftstermine — nah genug für den Abend in der Stadt, weit genug für absolute Ruhe am See.",
      en: "Culture, dining, business — close enough for an evening in the city, far enough for absolute peace at the lake.",
    },
  },

  /* Alltag */
  {
    id: "einkauf",
    cat: "daily",
    icon: "shop",
    lat: 52.229,
    lon: 13.752,
    km: 3,
    min: 5,
    mode: "car",
    dy: -9,
    img: { src: "/media/geo/einkauf.webp", credit: "Foto: C.-J. Dickow · CC BY-SA 3.0 (Wikimedia)" },
    route: [[455, 462], [440, 470], [418, 458]],
    name: { de: "EDEKA Prieros", en: "EDEKA Prieros" },
    desc: {
      de: "Der EDEKA in Prieros ist nur drei Kilometer entfernt — der schnelle Einkauf zwischendurch. Vollsortiment mit Feinbäckerei Heider und Sparkasse: EDEKA Wilde in Friedersdorf (10 Min.), Lidl & Netto in Storkow.",
      en: "The EDEKA in Prieros is just three kilometres away — for the quick shop in between. Full range with the Heider bakery and a Sparkasse branch: EDEKA Wilde in Friedersdorf (10 min), Lidl & Netto in Storkow.",
    },
  },
  {
    id: "aerzte",
    cat: "daily",
    icon: "med",
    lat: 52.29369,
    lon: 13.78793,
    km: 7.4,
    min: 10,
    mode: "car",
    dx: -8,
    img: { src: "/media/geo/aerzte.webp", credit: "Foto: Dguendel · CC BY 4.0 (Wikimedia)" },
    route: [[463, 452], [428, 408], [446, 377], [442, 375]],
    name: { de: "Ärzte & Apotheke Friedersdorf", en: "Doctors & pharmacy, Friedersdorf" },
    desc: {
      de: "Margareten-Apotheke und zwei Hausarztpraxen liegen keine 100 Meter auseinander — Arzttermin und Rezept in einem Weg.",
      en: "The Margareten pharmacy and two GP practices sit barely 100 metres apart — appointment and prescription in a single errand.",
    },
  },
  {
    id: "schule",
    cat: "daily",
    icon: "school",
    lat: 52.2265,
    lon: 13.744,
    km: 3,
    min: 5,
    mode: "car",
    dy: 9,
    img: { src: "/media/geo/schule.webp", credit: "Foto: JCIV · CC BY-SA 4.0 (Wikimedia)" },
    route: [[455, 462], [440, 470], [411, 477]],
    name: { de: "Naturpark-Kita & Grundschule Prieros", en: "Nature-park kita & primary, Prieros" },
    desc: {
      de: "Naturpark-Kindertagesstätte und Naturpark-Grundschule liegen drei Kilometer entfernt in Prieros — kurze Wege von Anfang an. Weiterführend: Grund- und Oberschule Friedersdorf (10 Min.), Gymnasien in Königs Wusterhausen.",
      en: "The nature-park kindergarten and primary school are three kilometres away in Prieros — short routes from day one. Beyond that: the grades 1–10 school in Friedersdorf (10 min) and grammar schools in Königs Wusterhausen.",
    },
  },
  {
    id: "klinikum",
    cat: "daily",
    icon: "health",
    lat: 52.30345,
    lon: 13.62815,
    km: 23.3,
    min: 26,
    mode: "car",
    img: { src: "/media/geo/klinikum.webp", credit: "Foto: Bildarbeiter · CC BY-SA 4.0 (Wikimedia)" },
    route: [[463, 452], [428, 408], [380, 395], [340, 382], [311, 371], [309, 361]],
    name: { de: "Achenbach-Krankenhaus (KW)", en: "Achenbach hospital (KW)" },
    desc: {
      de: "267 Betten, neun Fachabteilungen, Notaufnahme: vollwertige stationäre Versorgung in verlässlicher Distanz.",
      en: "267 beds, nine departments and an emergency room: full inpatient care within reliable reach.",
    },
  },

  /* Freizeit & Kurort */
  {
    id: "dorfkrug",
    cat: "leisure",
    icon: "dine",
    lat: 52.2438,
    lon: 13.8043,
    km: 0.7,
    min: 9,
    mode: "foot",
    dx: -6,
    dy: 8,
    img: { src: "/media/geo/dorfkrug.webp", credit: "Foto: kaffeeeinstein · CC BY-SA 2.0 (Wikimedia)" },
    route: [[459, 453]],
    name: { de: "Alter Dorfkrug Kolberg", en: "Alter Dorfkrug, Kolberg" },
    desc: {
      de: "Das eigene Dorfgasthaus mit deutscher Küche, keine 700 Meter von der Haustür. Für den Sonntag: das Waldrestaurant am Tiefen See, sechs Autominuten.",
      en: "The village's own inn with German cooking, barely 700 metres from the door. For Sundays: the forest restaurant on Tiefer See, a six-minute drive.",
    },
  },
  {
    id: "therme",
    cat: "leisure",
    icon: "spa",
    lat: 52.291,
    lon: 14.0604,
    km: 22.1,
    min: 30,
    mode: "car",
    anchor: true,
    img: { src: "/media/geo/therme.webp", credit: "Foto: Sören Kusch · CC BY-SA 3.0 (Wikimedia)" },
    route: [[478, 432], [498, 411], [540, 424], [573, 433], [625, 408], [692, 379]],
    name: { de: "SaarowTherme · Bad Saarow", en: "SaarowTherme · Bad Saarow" },
    desc: {
      de: "Thermalsole, Saunawelt, Seeblick: der bekannteste Kurort östlich von Berlin ist Ihr Wellness-Refugium — eine halbe Stunde entfernt.",
      en: "Thermal brine, sauna world, lake views: the best-known spa town east of Berlin is your wellness retreat — half an hour away.",
    },
  },
  {
    id: "golf",
    cat: "leisure",
    icon: "golf",
    lat: 52.2397,
    lon: 14.0294,
    km: 21.4,
    min: 27,
    mode: "car",
    img: { src: "/media/geo/golf.webp", credit: "Foto: Goldmull · CC BY-SA 4.0 (Wikimedia)" },
    route: [[478, 432], [498, 411], [540, 424], [573, 433], [620, 448], [674, 451]],
    name: { de: "Golfresort Bad Saarow · A-ROSA", en: "Bad Saarow golf resort · A-ROSA" },
    desc: {
      de: "63 Löcher — Deutschlands größtes Golfresort mit Faldo- und Palmer-Course, dazu das 5-Sterne-A-ROSA am Scharmützelsee, dem „Märkischen Meer“.",
      en: "63 holes — Germany's largest golf resort with the Faldo and Palmer courses, plus the 5-star A-ROSA on Lake Scharmützel, the “Sea of Brandenburg”.",
    },
  },
  {
    id: "tropical",
    cat: "leisure",
    icon: "palm",
    lat: 52.0383,
    lon: 13.7486,
    km: 50.9,
    min: 42,
    mode: "car",
    img: { src: "/media/geo/tropical.webp", credit: "Foto: Gerd Danigel · CC BY-SA 4.0 (Wikimedia)" },
    route: [[455, 462], [432, 478], [398, 530], [348, 583], [362, 640], [378, 700], [415, 735]],
    name: { de: "Tropical Islands", en: "Tropical Islands" },
    desc: {
      de: "Das größte Indoor-Tropenresort der Welt: Südsee-Feeling an 365 Tagen — mit Kindern oder Gästen ein halber Tag Urlaub.",
      en: "The world's largest indoor tropical resort: South Seas feeling 365 days a year — half a day of holiday with kids or guests.",
    },
  },
];

/* ── Стилізована картографія (координати вже в SVG-просторі) ───── */

/** Озера (спокійні плями) */
export const LAKES: string[] = [
  /* Wolziger See — на північ від Kolberg */
  "M 458 400 C 452 414, 454 430, 464 440 C 474 449, 492 447, 499 434 C 505 421, 502 404, 491 396 C 480 388, 465 389, 458 400 Z",
  /* Langer See — західніше села, вздовж Dahme */
  "M 447 434 C 443 442, 443 452, 448 458 C 453 463, 459 459, 458 450 C 457 441, 453 430, 447 434 Z",
  /* Storkower See */
  "M 542 405 C 537 415, 540 428, 550 432 C 560 436, 570 428, 568 416 C 566 406, 552 398, 542 405 Z",
  /* Großer Schauener See (ланцюг Наturpark) */
  "M 524 452 C 519 460, 522 470, 531 473 C 540 476, 548 469, 545 459 C 542 451, 529 445, 524 452 Z",
  /* Scharmützelsee — «Märkisches Meer», 10 км з півночі на південь */
  "M 685 372 C 696 392, 694 420, 686 448 C 678 476, 666 496, 656 500 C 646 502, 642 492, 648 478 C 658 452, 668 420, 674 396 C 678 380, 678 368, 685 372 Z",
  /* Glubigsee-ланцюг (Wendisch Rietz) */
  "M 633 466 C 628 473, 631 482, 639 484 C 647 486, 653 479, 650 471 C 647 464, 637 460, 633 466 Z",
  /* Springsee */
  "M 614 410 C 610 416, 613 424, 620 426 C 627 428, 632 421, 629 414 C 626 408, 618 405, 614 410 Z",
  /* Tiefer See (Prieros) */
  "M 449 476 C 445 482, 448 489, 455 491 C 462 493, 468 487, 465 480 C 462 474, 453 470, 449 476 Z",
  /* Hölzerner See (Gräbendorf) */
  "M 348 388 C 344 394, 347 402, 354 404 C 361 406, 366 399, 363 392 C 360 386, 352 383, 348 388 Z",
  /* Klein Köriser See */
  "M 329 515 C 325 522, 328 531, 337 533 C 346 535, 353 528, 350 519 C 347 511, 334 508, 329 515 Z",
  /* Müggelsee */
  "M 290 170 C 298 158, 330 154, 346 166 C 358 175, 354 190, 336 194 C 316 198, 294 192, 290 178 Z",
  /* Dämeritzsee (Erkner) */
  "M 356 164 C 352 170, 355 178, 362 180 C 369 182, 374 175, 371 168 C 368 162, 360 159, 356 164 Z",
  /* Seddinsee */
  "M 346 246 C 341 253, 344 262, 352 265 C 360 268, 366 261, 363 252 C 360 245, 351 240, 346 246 Z",
  /* Zeuthener See */
  "M 300 262 C 294 274, 300 288, 312 296 C 322 302, 332 296, 330 284 C 328 272, 312 256, 300 262 Z",
  /* Krossinsee */
  "M 330 352 C 326 358, 329 366, 336 368 C 343 370, 348 363, 345 356 C 342 350, 334 347, 330 352 Z",
  /* Peetzsee (Grünheide, біля Tesla) */
  "M 472 202 C 468 208, 471 216, 478 218 C 485 220, 490 213, 487 206 C 484 200, 476 197, 472 202 Z",
  /* Werlsee (Grünheide) */
  "M 498 218 C 494 224, 497 232, 504 234 C 511 236, 516 229, 513 222 C 510 216, 502 213, 498 218 Z",
];

/** Річки та канали (тонкі водні лінії) */
export const RIVERS: { d: string; name?: string }[] = [
  /* Dahme: Prieros → Bindow → Königs Wusterhausen → Zeuthener See → Берлін */
  { d: "M 436 486 C 424 462, 408 442, 396 424 C 384 406, 360 390, 340 380 C 326 374, 316 372, 311 371 C 306 344, 306 318, 310 296 C 316 260, 330 220, 344 196", name: "Dahme" },
  /* канал Langer See → Dahme */
  { d: "M 448 442 C 430 434, 412 428, 398 422" },
  /* Storkower Kanal: Wolziger See → Storkower See */
  { d: "M 499 428 C 514 432, 528 428, 542 420" },
  /* Wendisch Rietz: Scharmützelsee → Glubig → Storkower See */
  { d: "M 656 498 C 648 488, 644 480, 642 474 C 636 462, 610 442, 570 428" },
  /* Spree: Fürstenwalde → Erkner → Müggelsee → Берлін */
  { d: "M 780 262 C 740 272, 710 278, 691 281 C 640 288, 540 260, 470 220 C 448 208, 430 200, 417 197 C 398 190, 375 180, 361 176 C 330 168, 300 150, 270 120", name: "Spree" },
];

/** Автобани */
export const ROADS: { d: string; label: string; lx: number; ly: number }[] = [
  { d: "M 20 200 C 100 260, 180 290, 261 297 C 340 303, 390 290, 421 277 C 450 264, 458 240, 462 205", label: "A10", lx: 175, ly: 272 },
  { d: "M 421 277 C 432 298, 440 318, 446 338 C 456 360, 500 362, 560 348 C 620 334, 690 312, 780 290", label: "A12", lx: 600, ly: 352 },
  { d: "M 261 297 C 280 380, 310 480, 340 570 C 355 625, 372 690, 384 740", label: "A13", lx: 318, ly: 520 },
];

/** Другорядні дороги (ледь помітні) */
export const BROADS: string[] = [
  /* B246: Mittenwalde → Friedersdorf → Storkow → далі на схід */
  "M 300 384 C 360 380, 410 376, 452 374 C 500 372, 540 400, 573 430 C 610 438, 680 436, 750 428",
  /* локальна: Prieros → Kolberg → Wolzig → A12 */
  "M 432 478 C 446 468, 456 460, 463 452 C 478 436, 490 422, 498 411 C 510 396, 530 372, 552 352",
  /* Friedersdorf → Bindow → Kolberg (шлях від A12 у село) */
  "M 452 374 C 436 390, 420 408, 440 430 C 450 440, 458 446, 463 452",
  /* L74: Wolzig → Storkow */
  "M 498 411 C 525 415, 550 424, 573 433",
  /* Storkow → Bad Saarow (до Therme) */
  "M 573 433 C 615 420, 655 398, 692 379",
  /* Storkow → Wendisch Rietz → гольф-резорт */
  "M 573 433 C 600 445, 640 452, 674 451",
  /* Bindow → Senzig → Königs Wusterhausen */
  "M 428 408 C 395 402, 355 390, 311 371",
  /* Prieros → Halbe → A13 (на південь) */
  "M 432 478 C 410 515, 380 555, 348 585",
  /* A113: Schönefelder Kreuz → Берлін */
  "M 261 297 C 235 235, 200 150, 130 66",
];

/** Залізниці (пунктир) */
export const RAIL = "M 311 374 C 390 400, 480 425, 568 434 C 610 438, 650 436, 700 425";
/** Görlitzer Bahn: Берлін → Königs Wusterhausen → південь (повз Tropical Islands) */
export const RAIL2 = "M 285 300 C 300 335, 308 356, 311 371 C 322 420, 350 540, 375 660 L 385 740";

/** Міста без POI (маленькі кола + підписи) */
export const TOWNS: { x: number; y: number; name: string }[] = [
  { x: 498, y: 411, name: "Wolzig" },
  { x: 470, y: 197, name: "Grünheide" },
  { x: 417, y: 190, name: "Erkner" },
  { x: 691, y: 281, name: "Fürstenwalde" },
  { x: 643, y: 493, name: "Wendisch Rietz" },
  { x: 432, y: 486, name: "Prieros" },
];

/** Лісові масиви (м'які плями, майже непомітні) */
export const FORESTS: string[] = [
  /* Naturpark Dahme-Heideseen — південь від Kolberg */
  "M 380 440 C 360 470, 360 520, 390 550 C 430 580, 500 585, 545 560 C 585 538, 595 495, 575 465 C 555 438, 520 450, 490 455 C 450 462, 405 420, 380 440 Z",
  /* Ліси Grünheide (довкола Tesla) */
  "M 420 160 C 405 185, 410 220, 435 240 C 465 262, 510 258, 532 235 C 550 215, 545 185, 525 168 C 500 148, 445 140, 420 160 Z",
  /* Dubrow (захід від Prieros) */
  "M 340 430 C 325 450, 328 480, 348 495 C 370 510, 398 505, 408 485 C 416 466, 405 445, 385 436 C 368 428, 352 420, 340 430 Z",
  /* бори довкола Scharmützelsee */
  "M 610 330 C 595 355, 598 395, 618 420 C 640 448, 650 470, 645 500 C 660 505, 680 500, 690 480 C 700 455, 700 420, 705 390 C 710 360, 700 330, 675 318 C 650 306, 625 310, 610 330 Z",
];

/** Пляма Берліна (верхній лівий кут) */
export const BERLIN_BLOB =
  "M 40 20 C 100 10, 150 30, 165 70 C 175 100, 150 130, 110 128 C 70 126, 40 100, 32 60 Z";
