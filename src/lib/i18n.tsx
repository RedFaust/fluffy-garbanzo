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
    /* без «unten links» / «oben rechts»: на телефоні стрічка ракурсів і
       план стоять під кадром, а не збоку — опис має пасувати обом версіям */
    text: "Neun Räume, frei erkundbar: ziehen Sie das Bild, um sich umzuschauen, zoomen Sie hinein — und wechseln Sie die Blickwinkel. Der Grundriss zeigt jede Etage; ein Klick auf einen Punkt bringt Sie in den Raum.",
    hint: "Ziehen, um sich umzusehen",
    angles: "Blickwinkel",
    openPlan: "Grundriss groß ansehen",
    planHint: "Auf einen Punkt tippen — Sie springen direkt in den Raum",
    fsOpen: "Vollbild",
    fsExit: "Vollbild verlassen",
    fsKeys: "← → Raum · ↑ ↓ Blickwinkel · Esc schließt",
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
    consent:
      "Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet und dafür über den Messenger Telegram (Drittland) an uns übermittelt werden. Widerruf jederzeit möglich.",
    consentLink: "Datenschutzerklärung lesen",
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
      {
        h: "Angaben gemäß § 5 DDG",
        p: [
          "Aloha Living Immobilien GmbH · Seestraße 121 · 15738 Zeuthen",
          "Vertreten durch: [Geschäftsführung eintragen]",
          "Kontakt: [Telefon eintragen] · [E-Mail eintragen]",
          "Registergericht und Handelsregisternummer: [eintragen]",
          "Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG: [eintragen]",
        ],
      },
      {
        h: "Berufsrechtliche Angaben",
        p: [
          "Erlaubnis nach § 34 c Abs. 1 GewO, erteilt durch: [zuständige Behörde eintragen]",
          "Zuständige Aufsichtsbehörde: [eintragen]",
        ],
      },
      {
        h: "Streitbeilegung",
        p: [
          "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr",
          "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
        ],
      },
      {
        h: "Haftung für Inhalte und Links",
        p: [
          "Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.",
          "Für Inhalte externer Links ist stets der jeweilige Anbieter der verlinkten Seiten verantwortlich. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.",
        ],
      },
      {
        h: "Bildnachweise",
        p: [
          "Fotografien des Anwesens: [Urheber eintragen]. Einzelne Umgebungsaufnahmen stammen von Wikimedia Commons und sind am jeweiligen Bild mit Urheber und Lizenz gekennzeichnet.",
        ],
      },
    ],
    datenschutzTitle: "Datenschutzerklärung",
    datenschutzBody: [
      {
        p: [
          "Der Schutz Ihrer persönlichen Daten ist uns wichtig. Nachfolgend informieren wir Sie gemäß Art. 13 und 14 DSGVO darüber, welche Daten beim Besuch dieser Website verarbeitet werden, zu welchem Zweck und auf welcher Rechtsgrundlage.",
        ],
      },
      {
        h: "1. Verantwortlicher",
        p: [
          "Verantwortlich für die Datenverarbeitung auf dieser Website ist:",
          "Aloha Living Immobilien GmbH · Seestraße 121 · 15738 Zeuthen · [Telefon eintragen] · [E-Mail eintragen]",
          "Ein Datenschutzbeauftragter ist nicht bestellt, da die gesetzlichen Voraussetzungen hierfür nicht vorliegen. Für Anliegen zum Datenschutz wenden Sie sich bitte an die oben genannte Adresse.",
        ],
      },
      {
        h: "2. Ihre Rechte",
        p: [
          "Sie haben jederzeit das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO), auf Berichtigung (Art. 16), auf Löschung (Art. 17), auf Einschränkung der Verarbeitung (Art. 18), auf Datenübertragbarkeit (Art. 20) sowie auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO).",
          "Soweit die Verarbeitung auf Ihrer Einwilligung beruht, können Sie diese jederzeit mit Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt davon unberührt. Eine formlose Nachricht an die oben genannte Adresse genügt.",
          "Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Für uns zuständig ist: Die Landesbeauftragte für den Datenschutz und für das Recht auf Akteneinsicht Brandenburg, Stahnsdorfer Damm 77, 14532 Kleinmachnow.",
        ],
      },
      {
        h: "3. Hosting und Server-Logfiles",
        p: [
          "Diese Website wird bei der Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, USA gehostet. Beim Aufruf der Seiten erhebt der Anbieter automatisch Zugriffsdaten in Server-Logfiles: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Datei, übertragene Datenmenge, Referrer-URL sowie Browser- und Betriebssystemkennung.",
          "Diese Daten sind für den technischen Betrieb und die Sicherheit der Website erforderlich. Rechtsgrundlage ist unser berechtigtes Interesse an einer stabilen und sicheren Bereitstellung (Art. 6 Abs. 1 lit. f DSGVO). Eine Zusammenführung mit anderen Datenquellen findet nicht statt.",
          "Mit dem Anbieter besteht ein Vertrag über die Auftragsverarbeitung. Da die Verarbeitung auch in den USA erfolgen kann, stützt sich die Übermittlung auf die Standardvertragsklauseln der EU-Kommission beziehungsweise auf das EU-US Data Privacy Framework.",
        ],
      },
      {
        h: "4. Kontaktformular",
        p: [
          "Wenn Sie uns über das Formular kontaktieren, verarbeiten wir die von Ihnen angegebenen Daten: Ihr Name und Ihre E-Mail-Adresse (Pflichtangaben), optional Telefonnummer und Nachricht, sowie Ihr gewähltes Anliegen (Besichtigung, Exposé oder Rückruf).",
          "Zusätzlich übermitteln wir mit Ihrer Anfrage technische Angaben zum besseren Verständnis des Kontexts: die von Ihnen genutzte Sprachversion, das verwendete Formular, die Geräteart (mobil, Tablet oder Desktop), die aufgerufene Seite sowie das ungefähre Herkunftsland — siehe Abschnitt 6.",
          "Zweck der Verarbeitung ist ausschließlich die Bearbeitung und Beantwortung Ihrer Anfrage. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sowie, soweit Ihre Anfrage auf den Abschluss eines Vertrages gerichtet ist, Art. 6 Abs. 1 lit. b DSGVO.",
          "Die Angabe der Daten ist freiwillig. Ohne Name und E-Mail-Adresse können wir Ihre Anfrage jedoch nicht beantworten.",
          "Zum Schutz vor automatisierten Zusendungen enthält das Formular ein für Sie unsichtbares Feld sowie eine technische Begrenzung der Anzahl der Übermittlungen pro Zeitraum. Es findet keine Auswertung Ihres Verhaltens statt.",
        ],
      },
      {
        h: "5. Übermittlung Ihrer Anfrage über Telegram",
        p: [
          "Ihre Formularanfrage wird von unserem Server als Nachricht in eine private, nicht öffentliche Gruppe des Messengers Telegram zugestellt, damit wir zeitnah reagieren können. Anbieter ist die Telegram FZ-LLC, Business Center 1, Dubai Media City, Vereinigte Arabische Emirate.",
          "Die Vereinigten Arabischen Emirate sind ein Drittland, für das kein Angemessenheitsbeschluss der EU-Kommission vorliegt. Ein dem europäischen Recht entsprechendes Datenschutzniveau kann daher nicht garantiert werden; insbesondere bestehen möglicherweise weitergehende Zugriffsrechte staatlicher Stellen und eingeschränkte Rechtsschutzmöglichkeiten.",
          "Die Übermittlung erfolgt ausschließlich auf Grundlage Ihrer ausdrücklichen Einwilligung nach Art. 49 Abs. 1 lit. a DSGVO, die Sie mit dem Absenden des Formulars erteilen. Sie können diese Einwilligung jederzeit für die Zukunft widerrufen. Wünschen Sie keine Übermittlung über Telegram, kontaktieren Sie uns bitte direkt per E-Mail oder Telefon — die Kontaktdaten finden Sie im Impressum.",
        ],
      },
      {
        h: "6. Ungefähre Standortbestimmung",
        p: [
          "Unser Hosting-Anbieter ermittelt anhand Ihrer IP-Adresse das ungefähre Herkunftsland und gegebenenfalls die Region oder Stadt. Diese Angabe wird der Anfrage beigefügt, damit wir einschätzen können, aus welchem Markt sie stammt.",
          "Es handelt sich um eine grobe, aus der IP-Adresse abgeleitete Schätzung. Eine genaue Standortbestimmung, ein Zugriff auf GPS-Daten oder eine Ortung Ihres Endgeräts finden nicht statt. Die IP-Adresse selbst wird der Anfrage nicht beigefügt.",
        ],
      },
      {
        h: "7. Google Maps",
        p: [
          "Auf der Seite steht eine Kartenansicht von Google Maps zur Verfügung. Diese wird bewusst nicht automatisch geladen: Erst wenn Sie die Kartenansicht ausdrücklich aktivieren, wird eine Verbindung zu Servern von Google hergestellt und Ihre IP-Adresse dorthin übertragen.",
          "Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; eine Übermittlung in die USA an die Google LLC ist möglich. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie durch das Aktivieren der Karte erteilen und durch einen Wechsel zur illustrierten Karte jederzeit beenden können.",
          "Solange Sie die Kartenansicht nicht aktivieren, werden keinerlei Daten an Google übertragen.",
        ],
      },
      {
        h: "8. Speicherung im Browser, keine Cookies",
        p: [
          "Diese Website setzt keine Cookies und verwendet keine Analyse-, Tracking- oder Werbedienste. Es findet kein Profiling und keine automatisierte Entscheidungsfindung statt.",
          "Im Session-Speicher Ihres Browsers wird ein einzelner technischer Wert abgelegt, der lediglich vermerkt, ob Ihnen der Bedienhinweis im 3D-Rundgang bereits angezeigt wurde. Er enthält keine personenbezogenen Daten und wird beim Schließen des Browser-Tabs automatisch gelöscht.",
          "Schriften, Bilder und Videos werden von unserem eigenen Server ausgeliefert. Eine Einbindung externer Content-Delivery-Netzwerke oder Schriftdienste findet nicht statt.",
        ],
      },
      {
        h: "9. Speicherdauer",
        p: [
          "Server-Logfiles werden nach kurzer Zeit automatisch gelöscht, soweit sie nicht ausnahmsweise zur Aufklärung eines Sicherheitsvorfalls benötigt werden.",
          "Anfragen aus dem Kontaktformular löschen wir, sobald sie abschließend bearbeitet sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Führt Ihre Anfrage zu einem Vertragsverhältnis, gelten die handels- und steuerrechtlichen Aufbewahrungsfristen von sechs beziehungsweise zehn Jahren.",
        ],
      },
      {
        h: "10. Stand dieser Erklärung",
        p: [
          "Diese Datenschutzerklärung gilt ab dem Zeitpunkt der Veröffentlichung dieser Website. Bei Änderungen an der Website oder an den eingesetzten Diensten passen wir sie entsprechend an.",
        ],
      },
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
    planHint: "Tap a dot — you jump straight into that room",
    fsOpen: "Fullscreen",
    fsExit: "Exit fullscreen",
    fsKeys: "← → Room · ↑ ↓ Angle · Esc closes",
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
      /* не 11.12.2025: в англійській це читається і як 12 листопада */
      ["Issued", "11 Dec 2025 · valid until 10 Dec 2035"],
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
    consent:
      "I agree that my details may be processed to handle my enquiry and transmitted to us for that purpose via the Telegram messenger (third country). Withdrawable at any time.",
    consentLink: "Read the privacy policy",
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
      {
        h: "Information pursuant to § 5 DDG",
        p: [
          "Aloha Living Immobilien GmbH · Seestraße 121 · 15738 Zeuthen · Germany",
          "Represented by: [add management]",
          "Contact: [add phone] · [add email]",
          "Register court and commercial register number: [add]",
          "VAT identification number pursuant to § 27 a UStG: [add]",
        ],
      },
      {
        h: "Professional regulations",
        p: [
          "Licence under § 34 c (1) of the German Trade Regulation Act, issued by: [add competent authority]",
          "Competent supervisory authority: [add]",
        ],
      },
      {
        h: "Dispute resolution",
        p: [
          "The European Commission provides a platform for online dispute resolution: https://ec.europa.eu/consumers/odr",
          "We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.",
        ],
      },
      {
        h: "Liability for content and links",
        p: [
          "The content of these pages has been compiled with the greatest care. We cannot, however, guarantee that it is accurate, complete or up to date.",
          "The respective provider is always responsible for the content of external links. No legal infringements were apparent at the time the links were set.",
        ],
      },
      {
        h: "Image credits",
        p: [
          "Photographs of the property: [add author]. Individual photographs of the surroundings are taken from Wikimedia Commons and are credited with author and licence on the image itself.",
        ],
      },
    ],
    datenschutzTitle: "Privacy policy",
    datenschutzBody: [
      {
        p: [
          "Protecting your personal data matters to us. In accordance with Articles 13 and 14 GDPR, this notice explains which data we process when you visit this website, for what purpose and on what legal basis.",
        ],
      },
      {
        h: "1. Controller",
        p: [
          "The controller responsible for data processing on this website is:",
          "Aloha Living Immobilien GmbH · Seestraße 121 · 15738 Zeuthen · Germany · [add phone] · [add email]",
          "No data protection officer has been appointed, as the statutory requirements for doing so are not met. For any data protection matters, please write to the address above.",
        ],
      },
      {
        h: "2. Your rights",
        p: [
          "You have the right at any time to obtain information about the data we hold about you (Art. 15 GDPR), to have it rectified (Art. 16), erased (Art. 17) or its processing restricted (Art. 18), to data portability (Art. 20) and to object to processing (Art. 21 GDPR).",
          "Where processing is based on your consent, you may withdraw that consent at any time with effect for the future. This does not affect the lawfulness of processing carried out before withdrawal. An informal message to the address above is sufficient.",
          "You also have the right to lodge a complaint with a data protection supervisory authority (Art. 77 GDPR). The authority responsible for us is: Die Landesbeauftragte für den Datenschutz und für das Recht auf Akteneinsicht Brandenburg, Stahnsdorfer Damm 77, 14532 Kleinmachnow, Germany.",
        ],
      },
      {
        h: "3. Hosting and server log files",
        p: [
          "This website is hosted by Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, USA. When you open the pages, the provider automatically records access data in server log files: IP address, date and time of access, the file requested, the volume of data transferred, the referrer URL and your browser and operating system identifier.",
          "This data is necessary for the technical operation and security of the website. The legal basis is our legitimate interest in providing the site reliably and securely (Art. 6 (1) (f) GDPR). The data is not merged with other sources.",
          "A data processing agreement is in place with the provider. As processing may also take place in the USA, the transfer is based on the European Commission's standard contractual clauses or on the EU-US Data Privacy Framework.",
        ],
      },
      {
        h: "4. Contact form",
        p: [
          "When you contact us via the form, we process the details you provide: your name and email address (required), optionally your phone number and message, and the request you select (viewing, exposé or a call back).",
          "Together with your enquiry we also transmit technical details that help us understand its context: the language version you used, which form you used, the type of device (mobile, tablet or desktop), the page you were on and your approximate country of origin — see section 6.",
          "The sole purpose of processing is to handle and answer your enquiry. The legal basis is your consent (Art. 6 (1) (a) GDPR) and, where your enquiry is aimed at entering into a contract, Art. 6 (1) (b) GDPR.",
          "Providing the data is voluntary. Without your name and email address, however, we cannot reply to your enquiry.",
          "To guard against automated submissions, the form contains a field that is invisible to you and a technical limit on the number of submissions per period. Your behaviour is not analysed.",
        ],
      },
      {
        h: "5. Transmission of your enquiry via Telegram",
        p: [
          "Your form enquiry is delivered by our server as a message to a private, non-public group on the Telegram messenger so that we can respond promptly. The provider is Telegram FZ-LLC, Business Center 1, Dubai Media City, United Arab Emirates.",
          "The United Arab Emirates is a third country for which the European Commission has not issued an adequacy decision. A level of data protection equivalent to European law therefore cannot be guaranteed; in particular, state authorities may have broader rights of access and legal remedies may be limited.",
          "The transfer takes place solely on the basis of your explicit consent under Art. 49 (1) (a) GDPR, which you give when you submit the form. You may withdraw this consent at any time with effect for the future. If you prefer your enquiry not to be transmitted via Telegram, please contact us directly by email or phone — the details are in the imprint.",
        ],
      },
      {
        h: "6. Approximate location",
        p: [
          "Our hosting provider derives your approximate country of origin, and where applicable the region or city, from your IP address. This is attached to the enquiry so that we can tell which market it comes from.",
          "It is a rough estimate derived from the IP address. No precise positioning, no access to GPS data and no tracking of your device takes place. The IP address itself is not attached to the enquiry.",
        ],
      },
      {
        h: "7. Google Maps",
        p: [
          "A Google Maps view is available on the page. It is deliberately not loaded automatically: only when you explicitly activate the map view is a connection to Google's servers established and your IP address transmitted to them.",
          "The provider is Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland; a transfer to Google LLC in the USA is possible. The legal basis is your consent (Art. 6 (1) (a) GDPR), which you give by activating the map and can end at any time by switching back to the illustrated map.",
          "As long as you do not activate the map view, no data whatsoever is transmitted to Google.",
        ],
      },
      {
        h: "8. Browser storage, no cookies",
        p: [
          "This website sets no cookies and uses no analytics, tracking or advertising services. No profiling and no automated decision-making takes place.",
          "A single technical value is stored in your browser's session storage, recording only whether the operating hint in the 3D tour has already been shown to you. It contains no personal data and is deleted automatically when you close the browser tab.",
          "Fonts, images and videos are delivered from our own server. No external content delivery networks or font services are embedded.",
        ],
      },
      {
        h: "9. Retention periods",
        p: [
          "Server log files are deleted automatically after a short time, unless they are exceptionally required to investigate a security incident.",
          "We delete enquiries from the contact form once they have been dealt with conclusively and no statutory retention obligations apply. If your enquiry leads to a contractual relationship, the commercial and tax retention periods of six and ten years respectively apply.",
        ],
      },
      {
        h: "10. Status of this notice",
        p: [
          "This privacy policy applies from the date this website is published. We will update it accordingly if the website or the services it uses change.",
        ],
      },
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
