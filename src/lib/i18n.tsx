/* eslint-disable react-refresh/only-export-components */
/**
 * Двомовний словник DE/EN + контекст мови.
 * Тон: quiet luxury — спокійний прогрів без тиску.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "de" | "en";
type Dict = typeof de;

const de = {
  nav: {
    chapters: "Rundgang",
    plans: "3D-Rundgang",
    location: "Lage",
    facts: "Ausstattung",
    contact: "Kontakt",
    cta: "Privatbesichtigung",
  },

  clickCue: "Klick",

  hero: {
    kicker: "Kolberg · Heidesee · bei Berlin",
    titleA: "Ruhe ist",
    titleB: "der wahre Luxus.",
    sub: "Ein Anwesen am Kolberg, zwischen zwei Seen und Wald. Neubau 2022 — eine gute halbe Stunde vom BER, eine Welt entfernt vom Lärm.",
    scroll: "Scrollen, um einzutreten",
  },

  geo: {
    kicker: "Die Lage",
    title: "Mitten im Naturpark. Nah an allem.",
    intro:
      "Kolberg liegt am Wolziger See, im Naturpark Dahme-Heideseen — Wasser, Wald und Ruhe direkt vor der Tür. Und trotzdem sind BER, Berlin und die Gigafactory näher, als man denkt.",
    hint: "Punkt wählen — die Karte zeigt Ort und Entfernung.",
    mapAria: "Stilisierte Karte der Region zwischen Berlin und Bad Saarow",
    views: { art: "Illustriert", map: "Google Maps" } as Record<string, string>,
    viewsAria: "Kartenansicht wählen",
    gmapNote: "Google Maps wird aus Datenschutzgründen erst nach einem Klick geladen. Dabei werden Daten an Google übertragen.",
    gmapLoad: "Karte laden",
    gmapAttrib: "Punkt wählen — Google zeigt die Route ab Bergstraße 22A. Kartendaten © Google.",
    cats: {
      commute: "Anbindung",
      daily: "Alltag",
      water: "See & Natur",
      leisure: "Freizeit & Kurort",
    } as Record<string, string>,
    min: "Min.",
    byFoot: "zu Fuß",
    byBike: "per Rad",
    house: "Bergstraße 22A",
    note: "Fahr- und Gehzeiten: reale Straßenrouten (OpenStreetMap), gerundet.",
    value: {
      title: "Warum diese Lage mehr ist als eine Adresse.",
      cards: [
        {
          n: "01",
          h: "Der Tesla-Effekt",
          p: "Seit der Ansiedlung der Gigafactory (26 Min.) sind die Immobilienpreise im Umland um 20 bis 100 % gestiegen — über 11.000 Arbeitsplätze tragen die Nachfrage.",
        },
        {
          n: "02",
          h: "Ein endliches Gut",
          p: "95,8 % des Naturparks stehen unter Landschaftsschutz, unbebaute Uferzonen bleiben frei. Neue Grundstücke am See entstehen praktisch nicht mehr.",
        },
        {
          n: "03",
          h: "Eine wachsende Region",
          p: "Das Dahme-Seenland ist Brandenburgs am schnellsten wachsende Tourismusregion (+34,6 % Übernachtungen seit 2019) — bei deutlich niedrigerem Einstieg als im nahen Bad Saarow.",
        },
      ],
    },
  },

  haus: {
    kicker: "Der Rundgang",
    scrollHint: "Scrollen — der Weg führt nach rechts",
    facts: ["308 m² Wohnfläche", "1.485 m² Grundstück", "6 Zimmer · 4 Bäder", "Neubau 2022 · Klasse A"],
    cta: "Privatbesichtigung anfragen",
    ctaNote: "Diskret · unverbindlich · Betreuung durch Aloha Living Immobilien",
    specs: [
      { v: "2022", l: "Massivbau · Kalksandstein" },
      { v: "A", l: "Effizienzklasse · 36,87 kWh/(m²·a)" },
      { v: "1.000 l", l: "Weishaupt-Wärmepumpe · Pufferspeicher" },
      { v: "4/4", l: "Fußbodenheizung auf allen Ebenen" },
      { v: "24/7", l: "Alarm mit Polizeiaufschaltung · Smart Home" },
      { v: "3-fach", l: "Alu-Fenster · Sicherheitstür mit Fingerabdruck" },
    ],
    slides: [
      {
        floor: "Bergstraße 22A",
        title: "Zwölf Stationen. Ein Zuhause.",
        text: "Nehmen Sie sich vier Minuten Zeit. Wir gehen durch das Haus wie an einem freien Nachmittag — Raum für Raum, ohne Eile. Der Weg führt nach rechts.",
      },
      {
        floor: "Vorhof · Auffahrt",
        title: "Die Auffahrt erzählt es zuerst.",
        text: "Granit und Marmor im Vorhof, eine Rundauffahrt aus Naturstein, ein Springbrunnen, der den Tag leise begleitet. Das elektrische Tor schließt sich hinter Ihnen — und der Abstand zur Welt beginnt schon vor der Haustür.",
      },
      {
        floor: "Wohnbereich · EG",
        title: "Ein Himmel aus Licht.",
        text: "Bodentiefe Fenster öffnen den Wohnbereich zum Garten, venezianischer Putz fängt das Abendlicht. Später übernimmt der Kamin — und über allem eine Sternenhimmel-Decke, deren Licht Sie nach Stimmung wählen.",
      },
      {
        floor: "Küche & Essen · EG",
        title: "Der Mittelpunkt aller Abende.",
        text: "Dekton-Arbeitsplatte, Quooker für kochendes Wasser, Dampfbackofen: eine Küche, die für Gastgeber gebaut wurde. Und am River-Table daneben steht niemand freiwillig zuerst auf.",
      },
      {
        floor: "Schlafen · OG",
        title: "Morgens: Vogelstimmen. Sonst nichts.",
        text: "Drei Schlafzimmer mit Balkonen öffnen sich zum Grün. Das Haus liegt so ruhig, dass der Morgen mit Vogelstimmen beginnt — und jeder Tag hier eine Spur langsamer endet, als er begann.",
      },
      {
        floor: "Wellness-Bad · OG",
        title: "Ein Bad, das ein Spa sein will.",
        text: "Onyx und Marmor, Walk-in-Duschen, eine Wellness-Doppelwanne für zwei. Vier Bäder im Haus bedeuten: nie warten, nie teilen — jeder hat seinen eigenen Rückzugsort.",
      },
      {
        floor: "Atelier · DG",
        title: "Licht von oben, Ruhe ringsum.",
        text: "Unter sichtbaren Holzbalken und Oberlichtern liegt ein Boden, in Farbverläufen gegossen. Atelier, Studio, Galerie oder Büro — das Dachgeschoss stellt keine Bedingungen.",
      },
      {
        floor: "Fitness · UG",
        title: "Ihr Studio. Zwei Treppen entfernt.",
        text: "Kraftrahmen, Hantelbank, Spiegelwand: der Fitnessraum im Untergeschoss ersetzt die Mitgliedschaft. Zwei Treppen statt zwanzig Minuten Anfahrt — Training wird wieder zur Gewohnheit.",
      },
      {
        floor: "Einliegerwohnung · UG",
        title: "Platz für Gäste. Oder für Einnahmen.",
        text: "Separater Eingang, eigenes Bad, Küchenanschluss: die Einliegerwohnung funktioniert als Gästebereich, Praxis oder vermietete Einheit. Nähe, wenn man sie will — Unabhängigkeit, wenn man sie braucht.",
      },
      {
        floor: "Garten & Pool",
        title: "Urlaub, ohne zu packen.",
        text: "Der beheizte Salzwasserpool mit Gegenstromanlage und Massagedüsen liegt geschützt zwischen Haus und Wald. Drei Terrassen folgen der Sonne durch den Tag — abends knistert die Feuerstelle.",
      },
      {
        floor: "Haus & Technik",
        title: "Was man nicht sieht — aber jeden Tag spürt.",
        text: "Die eigentliche Qualität steckt unter der Oberfläche: massiv gebaut, sparsam im Verbrauch, durchdacht bis ins Schloss der Haustür.",
      },
      {
        floor: "",
        title: "Der nächste Schritt ist ein Nachmittag.",
        text: "Kein Exposé ersetzt das Gefühl, im Vorhof zu stehen, während der Brunnen läuft. Vereinbaren Sie eine private Besichtigung — diskret und ohne Zeitdruck.",
      },
    ],
  },
  moments: {
    list: [
      { time: "6:40 · Juli", line: "Sie schwimmen, bevor die Welt wach ist." },
      { time: "8:05 · Montag", line: "Die Autobahn ist zwölf Minuten entfernt. Sie müssen trotzdem nicht hin." },
      { time: "16:00 · Samstag", line: "Die Kinder kommen barfuß vom See zurück." },
      { time: "19:15 · Dienstag", line: "Das Tor schließt sich. Alles Laute bleibt draußen." },
      { time: "22:30 · Dezember", line: "Kamin an, Sternenhimmel an. Niemand will irgendwohin." },
      { time: "Irgendwann", line: "Jemand fragt, ob Sie je verkaufen würden. Sie lächeln nur." },
    ],
    finale: "Das alles steht in keinem Exposé.",
  },
  finale: {
    kicker: "Der nächste Schritt",
    title: "Manche Entscheidungen trifft man nicht am Bildschirm.",
    lead: "Vereinbaren Sie eine private Besichtigung — diskret, unverbindlich, zu Ihrer Zeit. Ein Nachmittag am Kolberg beantwortet mehr als jede Broschüre.",
    formCue: "Zwei Minuten — wir melden uns persönlich",
  },
  film: {
    kicker: "Der Film",
    title: "34 Sekunden Kolberg.",
    text: "Ein kurzer Rundgang, aufgenommen an einem gewöhnlichen Nachmittag. Ton an — der Rest erklärt sich selbst.",
    play: "Film abspielen",
  },

  pano: {
    kicker: "Der Rundblick",
    title: "Stehen Sie mitten im Raum.",
    text: "Neun Räume, frei erkundbar: ziehen Sie das Bild, um sich umzuschauen, zoomen Sie hinein — und wechseln Sie unten links die Blickwinkel. Der Grundriss oben rechts zeigt jede Etage; ein Klick auf einen Punkt bringt Sie in den Raum.",
    hint: "Ziehen, um sich umzusehen",
    angles: "Blickwinkel",
    openPlan: "Grundriss groß ansehen",
    rooms: {
      vorhof: "Vorhof & Auffahrt",
      wohnen: "Wohnbereich",
      essen: "Essbereich",
      kueche: "Designküche",
      schlafen: "Schlafzimmer",
      bad: "Wellness-Bad",
      atelier: "Atelier im Dach",
      fitness: "Fitnessraum",
      elw: "Einliegerwohnung",
      garten: "Garten & Pool",
    } as Record<string, string>,
  },

  estate: {
    kicker: "Das Haus in 3D",
    title: "Drehen Sie es. Öffnen Sie es.",
    text: "Vier Ebenen als Architekturmodell: ziehen zum Drehen, scrollen zum Zoomen — und mit einem Klick hebt sich das Haus Ebene für Ebene auseinander.",
    hint: "Ziehen → drehen · Scrollen → zoomen · Ebene anklicken",
    explode: "Ebenen öffnen",
    collapse: "Ebenen schließen",
    all: "Alle Ebenen",
    planLabel: "Grundriss ansehen",
    floors: [
      {
        id: "kg", label: "UG", name: "Untergeschoss",
        rooms: ["Wohnraum mit eigenem Bad", "Separater Eingang von außen", "Fitness- / Hobbyraum", "Technik & Hauswirtschaft", "Zugang zur Doppelgarage (beheizt)"],
        plan: "grundriss-kg",
      },
      {
        id: "eg", label: "EG", name: "Erdgeschoss",
        rooms: ["Küche / Wohnbereich · 54,9 m²", "Diele · 14,7 m²", "Büro · 12,5 m²", "Duschbad · 4,3 m²", "Abstellraum · 5,1 m²", "Terrassen nach Ost & West"],
        plan: "grundriss-eg",
      },
      {
        id: "og", label: "OG", name: "Obergeschoss",
        rooms: ["Schlafzimmer · 23,8 m²", "Schlafzimmer · 22,1 m²", "Schlafzimmer · 22,0 m²", "Bad mit Wellness-Wanne · 9,2 m²", "Duschbad · 5,3 m²", "Zwei Balkone"],
        plan: "grundriss-og",
      },
      {
        id: "dg", label: "DG", name: "Dachgeschoss",
        rooms: ["Offenes Atelier / Studio", "Sichtbare Holzbalken", "Oberlichter", "Boden in Farbverlauf gegossen", "Fußbodenheizung"],
        plan: "grundriss-dg",
      },
    ],
  },

  price: {
    kicker: "Preis & Energie",
    title: "Klar beziffert.",
    priceLabel: "Kaufpreis",
    energyTitle: "Energieausweis (Bedarfsausweis)",
    energyRows: [
      ["Endenergiebedarf", "36,87 kWh/(m²·a)"],
      ["Effizienzklasse", "A"],
      ["Wesentlicher Energieträger", "Luftwärmepumpe"],
      ["Baujahr Anlagentechnik", "2022"],
      ["Ausgestellt", "11.12.2025 · gültig bis 10.12.2035"],
    ],
    note: "Diese Immobilie wird im qualifizierten Alleinauftrag vermarktet. Alle Angaben ohne Gewähr; Grundlage ist der notarielle Kaufvertrag.",
  },

  contact: {
    kicker: "Der nächste Schritt",
    title: "Sehen Sie es mit eigenen Augen.",
    text: "Kein Formular ersetzt den Moment, in dem sich das Tor öffnet. Fordern Sie das vollständige Exposé an — oder vereinbaren Sie direkt eine private Besichtigung. Diskret, unverbindlich, in Ihrem Tempo.",
    interest: {
      label: "Ich interessiere mich für",
      options: [
        { id: "viewing", label: "Private Besichtigung" },
        { id: "expose", label: "Vollständiges Exposé" },
        { id: "call", label: "Rückruf" },
      ],
    },
    fields: {
      name: "Ihr Name",
      email: "E-Mail",
      phone: "Telefon (optional)",
      message: "Ihre Nachricht (optional)",
    },
    consent: "Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet werden. Details in der Datenschutzerklärung.",
    submit: "Anfrage senden",
    sending: "Wird gesendet …",
    success: "Vielen Dank. Wir melden uns persönlich — in der Regel noch am selben Tag.",
    error: "Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt:",
    or: "Oder direkt:",
  },

  contactModal: {
    title: "Sehen Sie es mit eigenen Augen.",
    text: "Diskret und unverbindlich — wir melden uns persönlich, in der Regel noch am selben Tag.",
  },

  footer: {
    broker: "Vermarktung",
    legalNote: "Alle Angaben ohne Gewähr. Irrtümer und Zwischenverkauf vorbehalten. Grundlage ist der notarielle Kaufvertrag.",
    impressum: "Impressum",
    datenschutz: "Datenschutz",
    rights: "Alle Rechte vorbehalten.",
  },

  legal: {
    impressumTitle: "Impressum",
    impressumBody: [
      "Angaben gemäß § 5 TMG — PLATZHALTER, vor Veröffentlichung ersetzen.",
      "Aloha Living Immobilien GmbH · Seestraße 121 · 15738 Zeuthen",
      "Vertreten durch: [Geschäftsführung eintragen]",
      "Kontakt: [Telefon] · [E-Mail]",
      "Registereintrag, USt-IdNr. und Aufsichtsbehörde ergänzen.",
    ],
    datenschutzTitle: "Datenschutzerklärung",
    datenschutzBody: [
      "PLATZHALTER — vor Veröffentlichung durch vollständige Datenschutzerklärung ersetzen.",
      "Diese Website verwendet keine Tracking-Cookies und keine externen Analysedienste.",
      "Schriften und alle Medien werden lokal gehostet; es findet keine Übertragung an Dritt-CDNs statt.",
      "Bei Nutzung des Kontaktformulars werden die von Ihnen angegebenen Daten ausschließlich zur Bearbeitung Ihrer Anfrage verarbeitet und an den beauftragten Makler übermittelt.",
    ],
    close: "Schließen",
  },
};

const en: Dict = {
  nav: {
    chapters: "The tour",
    plans: "3D tour",
    location: "Location",
    facts: "Features",
    contact: "Contact",
    cta: "Private viewing",
  },

  clickCue: "Click",

  hero: {
    kicker: "Kolberg · Heidesee · near Berlin",
    titleA: "Quiet is",
    titleB: "the true luxury.",
    sub: "An estate at Kolberg, between two lakes and the forest. Built 2022 — a good half hour from BER airport, a world away from the noise.",
    scroll: "Scroll to enter",
  },

  geo: {
    kicker: "The location",
    title: "Inside a nature park. Close to everything.",
    intro:
      "Kolberg sits on Lake Wolzig, inside the Dahme-Heideseen nature park — water, forest and quiet right outside the door. Yet BER, Berlin and the Gigafactory are closer than you'd think.",
    hint: "Pick a point — the map shows where it is and how far.",
    mapAria: "Stylised map of the region between Berlin and Bad Saarow",
    views: { art: "Illustrated", map: "Google Maps" } as Record<string, string>,
    viewsAria: "Choose map view",
    gmapNote: "For privacy reasons, Google Maps loads only after a click. Data is then transferred to Google.",
    gmapLoad: "Load map",
    gmapAttrib: "Pick a point — Google shows the route from Bergstraße 22A. Map data © Google.",
    cats: {
      commute: "Getting around",
      daily: "Everyday life",
      water: "Lake & nature",
      leisure: "Leisure & resort",
    } as Record<string, string>,
    min: "min",
    byFoot: "on foot",
    byBike: "by bike",
    house: "Bergstraße 22A",
    note: "Travel times: real road routes (OpenStreetMap), rounded.",
    value: {
      title: "Why this location is more than an address.",
      cards: [
        {
          n: "01",
          h: "The Tesla effect",
          p: "Since the Gigafactory arrived (26 min), property prices in the surrounding area have risen 20 to 100 % — over 11,000 jobs keep driving demand.",
        },
        {
          n: "02",
          h: "A finite asset",
          p: "95.8 % of the nature park is under landscape protection and undeveloped shorelines stay free. New lakeside plots have practically ceased to exist.",
        },
        {
          n: "03",
          h: "A growing region",
          p: "The Dahme lake district is Brandenburg's fastest-growing tourism region (+34.6 % overnight stays since 2019) — at a far lower entry price than nearby Bad Saarow.",
        },
      ],
    },
  },

  haus: {
    kicker: "The tour",
    scrollHint: "Scroll — the path leads right",
    facts: ["308 m² living space", "1,485 m² plot", "6 rooms · 4 baths", "Built 2022 · class A"],
    cta: "Request a private viewing",
    ctaNote: "Discreet · no obligation · handled by Aloha Living Immobilien",
    specs: [
      { v: "2022", l: "Solid build · sand-lime brick" },
      { v: "A", l: "Efficiency class · 36.87 kWh/(m²·a)" },
      { v: "1,000 l", l: "Weishaupt heat pump · buffer tank" },
      { v: "4/4", l: "Underfloor heating on all levels" },
      { v: "24/7", l: "Alarm with police link · smart home" },
      { v: "Triple", l: "Aluminium glazing · fingerprint entry door" },
    ],
    slides: [
      {
        floor: "Bergstraße 22A",
        title: "Twelve stops. One home.",
        text: "Take four minutes. We'll walk the house the way you would on a free afternoon — room by room, unhurried. The path leads to the right.",
      },
      {
        floor: "Forecourt · driveway",
        title: "The driveway tells it first.",
        text: "Granite and marble in the forecourt, a circular natural-stone driveway, a fountain that quietly keeps the day company. The electric gate closes behind you — and the distance to the world begins at the doorstep.",
      },
      {
        floor: "Living · ground floor",
        title: "A sky made of light.",
        text: "Floor-to-ceiling windows open the living space to the garden; Venetian plaster catches the evening light. Later the fireplace takes over — and above it all, a starry-sky ceiling whose light you choose by mood.",
      },
      {
        floor: "Kitchen & dining",
        title: "The centre of every evening.",
        text: "Dekton worktop, Quooker for boiling water, steam oven: a kitchen built for hosts. And at the river table beside it, nobody leaves first.",
      },
      {
        floor: "Sleeping · upper floor",
        title: "Mornings: birdsong. Nothing else.",
        text: "Three bedrooms with balconies open into the green. The house sits so quietly that mornings begin with birdsong — and every day here ends a little slower than it began.",
      },
      {
        floor: "Wellness bath · upper floor",
        title: "A bathroom that wants to be a spa.",
        text: "Onyx and marble, walk-in showers, a wellness bath built for two. Four bathrooms in the house mean: no waiting, no sharing — everyone keeps their own retreat.",
      },
      {
        floor: "Studio · attic",
        title: "Light from above, quiet all around.",
        text: "Beneath exposed beams and skylights lies a floor poured in colour gradients. Studio, atelier, gallery or office — the attic makes no demands.",
      },
      {
        floor: "Gym · lower level",
        title: "Your gym. Two flights of stairs away.",
        text: "Power rack, bench, mirrored wall: the gym downstairs replaces the membership. Two flights of stairs instead of a twenty-minute drive — training becomes a habit again.",
      },
      {
        floor: "Annexe flat · lower level",
        title: "Room for guests. Or for income.",
        text: "Separate entrance, own bathroom, kitchen hook-up: the annexe works as a guest suite, a practice or a rented unit. Closeness when you want it — independence when you need it.",
      },
      {
        floor: "Garden & pool",
        title: "A holiday, without packing.",
        text: "The heated saltwater pool with counter-current and massage jets sits sheltered between house and forest. Three terraces follow the sun through the day — in the evening the fire pit crackles.",
      },
      {
        floor: "House & tech",
        title: "What you don't see — but feel every day.",
        text: "The real quality sits beneath the surface: solidly built, frugal in use, thought through down to the front-door lock.",
      },
      {
        floor: "",
        title: "The next step is an afternoon.",
        text: "No brochure replaces standing in the forecourt while the fountain runs. Arrange a private viewing — discreet and without time pressure.",
      },
    ],
  },
  moments: {
    list: [
      { time: "6:40 · July", line: "You swim before the world wakes up." },
      { time: "8:05 · Monday", line: "The autobahn is twelve minutes away. You still don't have to take it." },
      { time: "4 pm · Saturday", line: "The kids come back barefoot from the lake." },
      { time: "7:15 pm · Tuesday", line: "The gate closes. Everything loud stays outside." },
      { time: "10:30 pm · December", line: "Fire on, stars on. Nobody wants to be anywhere else." },
      { time: "Someday", line: "Someone asks if you would ever sell. You just smile." },
    ],
    finale: "None of this fits in a brochure.",
  },
  finale: {
    kicker: "The next step",
    title: "Some decisions aren't made on a screen.",
    lead: "Arrange a private viewing — discreet, no obligation, at your pace. One afternoon at Kolberg answers more than any brochure.",
    formCue: "Two minutes — we reply personally",
  },
  film: {
    kicker: "The film",
    title: "34 seconds of Kolberg.",
    text: "A short walkthrough, filmed on an ordinary afternoon. Sound on — the rest explains itself.",
    play: "Play film",
  },

  pano: {
    kicker: "The look around",
    title: "Stand in the middle of the room.",
    text: "Nine rooms, freely explorable: drag the image to look around, zoom in — and switch camera angles at the bottom left. The floor plan shows every level; click a dot to jump into that room.",
    hint: "Drag to look around",
    angles: "Angles",
    openPlan: "View floor plan large",
    rooms: {
      vorhof: "Forecourt & driveway",
      wohnen: "Living area",
      essen: "Dining area",
      kueche: "Designer kitchen",
      schlafen: "Bedroom",
      bad: "Wellness bath",
      atelier: "Attic studio",
      fitness: "Home gym",
      elw: "Granny flat",
      garten: "Garden & pool",
    } as Record<string, string>,
  },

  estate: {
    kicker: "The house in 3D",
    title: "Turn it. Open it.",
    text: "Four levels as an architect's model: drag to rotate, scroll to zoom — and with one click the house lifts apart, level by level.",
    hint: "Drag → rotate · Scroll → zoom · Click a level",
    explode: "Open levels",
    collapse: "Close levels",
    all: "All levels",
    planLabel: "View floor plan",
    floors: [
      {
        id: "kg", label: "LL", name: "Lower level",
        rooms: ["Living room with own bath", "Separate outside entrance", "Fitness / hobby room", "Utilities & laundry", "Access to heated double garage"],
        plan: "grundriss-kg",
      },
      {
        id: "eg", label: "GF", name: "Ground floor",
        rooms: ["Kitchen / living · 54.9 m²", "Hallway · 14.7 m²", "Study · 12.5 m²", "Shower room · 4.3 m²", "Storage · 5.1 m²", "Terraces east & west"],
        plan: "grundriss-eg",
      },
      {
        id: "og", label: "1F", name: "Upper floor",
        rooms: ["Bedroom · 23.8 m²", "Bedroom · 22.1 m²", "Bedroom · 22.0 m²", "Bath with wellness tub · 9.2 m²", "Shower room · 5.3 m²", "Two balconies"],
        plan: "grundriss-og",
      },
      {
        id: "dg", label: "2F", name: "Attic",
        rooms: ["Open atelier / studio", "Exposed wooden beams", "Skylights", "Poured gradient floor", "Underfloor heating"],
        plan: "grundriss-dg",
      },
    ],
  },

  price: {
    kicker: "Price & energy",
    title: "Clearly stated.",
    priceLabel: "Purchase price",
    energyTitle: "Energy certificate (demand-based)",
    energyRows: [
      ["Final energy demand", "36.87 kWh/(m²·a)"],
      ["Efficiency class", "A"],
      ["Main energy source", "Air-source heat pump"],
      ["Systems built", "2022"],
      ["Issued", "11.12.2025 · valid until 10.12.2035"],
    ],
    note: "This property is marketed under an exclusive brokerage mandate. All information without guarantee; the notarised purchase contract prevails.",
  },

  contact: {
    kicker: "The next step",
    title: "See it with your own eyes.",
    text: "No form replaces the moment the gate opens. Request the full exposé — or arrange a private viewing directly. Discreet, non-binding, at your pace.",
    interest: {
      label: "I am interested in",
      options: [
        { id: "viewing", label: "Private viewing" },
        { id: "expose", label: "Full exposé" },
        { id: "call", label: "A call back" },
      ],
    },
    fields: {
      name: "Your name",
      email: "Email",
      phone: "Phone (optional)",
      message: "Your message (optional)",
    },
    consent: "I agree that my details will be processed to handle my enquiry. Details in the privacy policy.",
    submit: "Send enquiry",
    sending: "Sending …",
    success: "Thank you. We will be in touch personally — usually the same day.",
    error: "That didn't work. Please try again or write to us directly:",
    or: "Or directly:",
  },

  contactModal: {
    title: "See it with your own eyes.",
    text: "Discreet and non-binding — we reply personally, usually the same day.",
  },

  footer: {
    broker: "Marketing",
    legalNote: "All information without guarantee. Errors and prior sale reserved. The notarised purchase contract prevails.",
    impressum: "Imprint",
    datenschutz: "Privacy",
    rights: "All rights reserved.",
  },

  legal: {
    impressumTitle: "Imprint",
    impressumBody: [
      "Information according to § 5 TMG — PLACEHOLDER, replace before publishing.",
      "Aloha Living Immobilien GmbH · Seestraße 121 · 15738 Zeuthen",
      "Represented by: [add management]",
      "Contact: [phone] · [email]",
      "Add register entry, VAT ID and supervisory authority.",
    ],
    datenschutzTitle: "Privacy policy",
    datenschutzBody: [
      "PLACEHOLDER — replace with a full privacy policy before publishing.",
      "This website uses no tracking cookies and no external analytics services.",
      "Fonts and all media are hosted locally; nothing is transferred to third-party CDNs.",
      "When you use the contact form, the data you provide is processed solely to handle your enquiry and forwarded to the appointed broker.",
    ],
    close: "Close",
  },
};

const dicts: Record<Lang, Dict> = { de, en };

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "de",
  setLang: () => {},
  t: de,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("de");
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <LangCtx.Provider value={{ lang, setLang, t: dicts[lang] }}>{children}</LangCtx.Provider>;
}

export function useT() {
  return useContext(LangCtx);
}
