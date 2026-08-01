/**
 * «Die Lage» — інтерактивна стилізована карта регіону + список переваг.
 * Клік на пункт → золота траса будинок→POI з відстанню; авто-цикл до
 * першої взаємодії. Зум/пан по карті (кнопки +/−, драг рукою при зумі),
 * іконки POI з кластеризацією (щільні групи — точки, при зумі — іконки).
 * Вкладка Google Maps: маршрут будинок→POI, свій зум. Без зайвих запитів.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "motion/react";
import {
  TrainFront, TramFront, CarFront, Plane, Factory, Landmark, ShoppingBag,
  GraduationCap, HeartPulse, Stethoscope, Waves, Ship, Sailboat, TreePine,
  Droplets, Flag, Palmtree, UtensilsCrossed, MapPin, Plus, Minus,
  type LucideIcon,
} from "lucide-react";
import { FadeUp } from "../ux/Reveal";
import { useT } from "../../lib/i18n";
import {
  POIS, HOUSE, PROJ, project, LAKES, RIVERS, ROADS, BROADS, RAIL, RAIL2,
  TOWNS, FORESTS, BERLIN_BLOB, type PoiCat,
} from "../../data/geo";

const ICONS: Record<string, LucideIcon> = {
  train: TrainFront, tram: TramFront, car: CarFront, plane: Plane,
  factory: Factory, landmark: Landmark, shop: ShoppingBag, school: GraduationCap,
  med: Stethoscope, health: HeartPulse, waves: Waves, ship: Ship, sail: Sailboat,
  forest: TreePine, spa: Droplets, golf: Flag, palm: Palmtree, dine: UtensilsCrossed,
};

const CATS: PoiCat[] = ["water", "commute", "daily", "leisure"];

/** Види карти: ілюстрована / Google */
type MapView = "art" | "map";

const H0 = project(HOUSE.lat, HOUSE.lon);

/** POI у щільних групах (при базовому масштабі — точки, не іконки) */
const CLUSTERED: Set<string> = (() => {
  const pts = POIS.map((p) => {
    const c = project(p.lat, p.lon);
    return { id: p.id, x: c.x + (p.dx ?? 0), y: c.y + (p.dy ?? 0) };
  });
  const s = new Set<string>();
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++)
      if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) < 28) {
        s.add(pts[i].id);
        s.add(pts[j].id);
      }
  return s;
})();

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

export default function GeoSection() {
  const { t, lang } = useT();
  const reduced = useReducedMotion();
  const secRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const inView = useInView(secRef, { margin: "-25% 0px -25% 0px" });
  const [activeId, setActiveId] = useState(POIS[0].id);
  const [touched, setTouched] = useState(false);
  const [view, setView] = useState<MapView>("art");
  /* Google Maps вантажиться лише після явної згоди (GDPR, два кліки) */
  const [gmapOk, setGmapOk] = useState(false);
  const [gz, setGz] = useState(11);
  /* зум/пан ілюстрованої карти */
  const [z, setZ] = useState(1);
  const [center, setCenter] = useState({ x: H0.x, y: H0.y });
  const drag = useRef<{ px: number; py: number; cx: number; cy: number } | null>(null);
  const suppressClick = useRef(false);

  /* видима область (viewBox) з кламповим центром */
  const vb = useMemo(() => {
    const w = PROJ.W / z;
    const h = PROJ.H / z;
    const cx = clamp(center.x, w / 2, PROJ.W - w / 2);
    const cy = clamp(center.y, h / 2, PROJ.H - h / 2);
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }, [z, center]);

  /* авто-прогулянка картою, поки користувач не втрутився */
  useEffect(() => {
    if (touched || reduced || !inView || view !== "art" || z !== 1) return;
    const iv = setInterval(() => {
      setActiveId((prev) => {
        const i = POIS.findIndex((p) => p.id === prev);
        return POIS[(i + 1) % POIS.length].id;
      });
    }, 4200);
    return () => clearInterval(iv);
  }, [touched, reduced, inView, view, z]);

  const active = POIS.find((p) => p.id === activeId)!;
  const h = H0;
  const apr = project(active.lat, active.lon);
  const ap = { x: apr.x + (active.dx ?? 0), y: apr.y + (active.dy ?? 0) };

  /* маршрут будинок → POI: по дорогах (вейпойнти зі згладжуванням);
     фолбек — м'яка дуга з перпендикулярним прогином */
  const arc = useMemo(() => {
    if (active.route && active.route.length) {
      const pts: [number, number][] = [[h.x, h.y], ...active.route];
      if (pts.length === 2)
        return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`;
      /* midpoint-quadratic: кути вейпойнтів стають плавними поворотами */
      let d = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length - 1; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[i + 1];
        const last = i === pts.length - 2;
        d += ` Q ${x1} ${y1} ${last ? x2 : (x1 + x2) / 2} ${last ? y2 : (y1 + y2) / 2}`;
      }
      return d;
    }
    const dx = ap.x - h.x, dy = ap.y - h.y;
    const len = Math.hypot(dx, dy) || 1;
    const k = Math.min(42, len * 0.18);
    const cx = (h.x + ap.x) / 2 - (dy / len) * k;
    const cy = (h.y + ap.y) / 2 + (dx / len) * k;
    return `M ${h.x} ${h.y} Q ${cx} ${cy} ${ap.x} ${ap.y}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, ap.x, ap.y, h.x, h.y]);

  const pick = (id: string, fromMap = false) => {
    if (fromMap && suppressClick.current) return;
    setTouched(true);
    setActiveId(id);
    /* клік по карті → прокручуємо список до пункту, щоб відкриту вкладку було
       видно. Чекаємо, поки попередня розкривашка згорнеться (вона зсуває
       контент), і міряємо позицію заново — інакше промах повз ціль. */
    if (fromMap) {
      window.setTimeout(() => {
        const el = itemRefs.current[id];
        if (!el) return;
        const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
        if (lenis)
          lenis.scrollTo(el, {
            offset: -(window.innerHeight / 2 - el.offsetHeight / 2),
            duration: 0.9,
          });
        else el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 430);
    }
    /* при зумі — просто віддаляємось до повного огляду:
       весь маршрут завжди видно */
    if (z > 1) {
      setZ(1);
      setCenter({ x: H0.x, y: H0.y });
    }
  };

  /* пан рукою при зумі */
  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (z <= 1 || view !== "art") return;
    /* натиск на маркер — це клік, не пан: інакше setPointerCapture
       перехопить click і іконки перестануть відкриватись */
    if ((e.target as Element).closest?.(".geo__dot")) return;
    e.preventDefault(); // без виділення тексту під час пану
    drag.current = { px: e.clientX, py: e.clientY, cx: center.x, cy: center.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const dx = e.clientX - drag.current.px;
    const dy = e.clientY - drag.current.py;
    if (Math.abs(dx) + Math.abs(dy) > 6) suppressClick.current = true;
    const f = vb.w / svgRef.current.clientWidth;
    setCenter({ x: drag.current.cx - dx * f, y: drag.current.cy - dy * f });
  };
  const onPointerUp = () => {
    drag.current = null;
    setTimeout(() => (suppressClick.current = false), 60);
  };

  const zoomIn = () =>
    view === "art" ? setZ((v) => clamp(+(v * 1.5).toFixed(3), 1, 3)) : setGz((v) => clamp(v + 1, 8, 16));
  const zoomOut = () => {
    if (view === "art")
      setZ((v) => {
        const nv = +(v / 1.5).toFixed(3);
        if (nv <= 1.01) {
          setCenter({ x: H0.x, y: H0.y });
          return 1;
        }
        return nv;
      });
    else setGz((v) => clamp(v - 1, 8, 16));
  };

  const dist = (p: typeof active) =>
    `${p.min} ${t.geo.min}${p.mode === "foot" ? ` ${t.geo.byFoot}` : p.mode === "bike" ? ` ${t.geo.byBike}` : ""}`;

  /* пігулка відносно видимої області, з клампом до країв */
  const pillLeft = clamp(((ap.x - vb.x) / vb.w) * 100, 14, 86);
  const pillTop = clamp(((ap.y - vb.y) / vb.h) * 100, 5, 95);
  const pillUp = pillTop > 16;
  const iz = 1 / z;

  return (
    <section className="geo" id="location" ref={secRef}>
      <div className="container">
        <div className="geo__head">
          <FadeUp>
            <span className="kicker">{t.geo.kicker}</span>
            <h2 className="geo__title display">{t.geo.title}</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="geo__intro lead">{t.geo.intro}</p>
          </FadeUp>
        </div>

        <div className="geo__grid">
          {/* ── Список переваг ── */}
          <div className="geo__list">
            {CATS.map((cat) => (
              <div className="geo__cat" key={cat}>
                <FadeUp amount={0.2}>
                  <h3 className="geo__cat-name">{t.geo.cats[cat]}</h3>
                </FadeUp>
                {POIS.filter((p) => p.cat === cat).map((p, i) => {
                  const Icon = ICONS[p.icon] ?? MapPin;
                  const on = p.id === activeId;
                  return (
                    <FadeUp key={p.id} delay={i * 0.05} amount={0.2}>
                      <button
                        ref={(el) => {
                          itemRefs.current[p.id] = el;
                        }}
                        className={`geo__item ${on ? "geo__item--on" : ""}`}
                        onClick={() => pick(p.id)}
                        aria-expanded={on}
                      >
                        <span className="geo__item-ic" aria-hidden="true">
                          <Icon size={17} strokeWidth={1.7} />
                        </span>
                        <span className="geo__item-name">{p.name[lang]}</span>
                        <span className="geo__item-chip">{dist(p)}</span>
                      </button>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.div
                            className="geo__item-desc"
                            initial={reduced ? false : { height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={reduced ? undefined : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div className="geo__item-body">
                              {p.img && (
                                <figure className="geo__item-media">
                                  <img
                                    src={p.img.src}
                                    alt={p.name[lang]}
                                    width={720}
                                    height={450}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                  <figcaption>{p.img.credit}</figcaption>
                                </figure>
                              )}
                              <p>{p.desc[lang]}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </FadeUp>
                  );
                })}
              </div>
            ))}
            <FadeUp amount={0.2}>
              <p className="geo__note">{t.geo.note}</p>
            </FadeUp>
          </div>

          {/* ── Карта ── */}
          <div className="geo__mapcol">
            <FadeUp amount={0.25} className="geo__map">
              <svg
                ref={svgRef}
                viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
                className={`geo__svg ${z > 1 ? "geo__svg--pan" : ""}`}
                role="img"
                aria-label={t.geo.mapAria}
                data-cursor={z > 1 ? "hand" : undefined}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <defs>
                  <radialGradient id="geo-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(196,161,95,0.35)" />
                    <stop offset="100%" stopColor="rgba(196,161,95,0)" />
                  </radialGradient>
                  <pattern id="geo-grid" width="52" height="52" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="rgba(236,231,220,0.07)" />
                  </pattern>
                </defs>

                <rect width={PROJ.W} height={PROJ.H} fill="url(#geo-grid)" />

                {/* ліси */}
                {FORESTS.map((d, i) => (
                  <path key={i} d={d} className="geo__forest" />
                ))}

                {/* Берлін */}
                <path d={BERLIN_BLOB} className="geo__berlin" vectorEffect="non-scaling-stroke" />
                <g transform={`translate(97 80) scale(${iz})`}>
                  <text className="geo__citylabel">BERLIN</text>
                </g>

                {/* річки й канали */}
                {RIVERS.map((r, i) => (
                  <path key={i} d={r.d} className="geo__river" vectorEffect="non-scaling-stroke" />
                ))}

                {/* озера */}
                {LAKES.map((d, i) => (
                  <path key={i} d={d} className="geo__lake" vectorEffect="non-scaling-stroke" />
                ))}

                {/* другорядні дороги */}
                {BROADS.map((d, i) => (
                  <path key={i} d={d} className="geo__broad" vectorEffect="non-scaling-stroke" />
                ))}

                {/* автобани */}
                {ROADS.map((r) => (
                  <g key={r.label}>
                    <path d={r.d} className="geo__road" vectorEffect="non-scaling-stroke" />
                    <g transform={`translate(${r.lx} ${r.ly}) scale(${iz})`}>
                      <text className="geo__roadlabel">{r.label}</text>
                    </g>
                  </g>
                ))}
                {/* залізниці */}
                <path d={RAIL} className="geo__rail" vectorEffect="non-scaling-stroke" />
                <path d={RAIL2} className="geo__rail" vectorEffect="non-scaling-stroke" />

                {/* міста без POI */}
                {TOWNS.map((tn) => (
                  <g key={tn.name} className="geo__town" transform={`translate(${tn.x} ${tn.y}) scale(${iz})`}>
                    <circle r="2.4" />
                    <text x="7" y="3.5">{tn.name}</text>
                  </g>
                ))}

                {/* траса будинок → активний POI */}
                {/* УВАГА: без vector-effect — він ламає pathLength-анімацію
                    при зумі (штрихи міряються в екранних координатах);
                    сталу товщину дає strokeWidth = 2/z */}
                {!reduced && (
                  <motion.path
                    key={activeId}
                    d={arc}
                    className="geo__arc"
                    strokeWidth={2 / z}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                {reduced && <path d={arc} className="geo__arc" strokeWidth={2 / z} />}

                {/* POI: іконки, у щільних групах — точки (іконки при зумі) */}
                {POIS.map((p) => {
                  const pr0 = project(p.lat, p.lon);
                  const c = { x: pr0.x + (p.dx ?? 0), y: pr0.y + (p.dy ?? 0) };
                  const on = p.id === activeId;
                  const Icon = ICONS[p.icon] ?? MapPin;
                  const asIcon = !CLUSTERED.has(p.id) || z >= 1.8;
                  const flip = c.x > PROJ.W - 130;
                  return (
                    <g
                      key={p.id}
                      className={`geo__dot ${on ? "geo__dot--on" : ""}`}
                      transform={`translate(${c.x} ${c.y}) scale(${iz})`}
                      onClick={() => pick(p.id, true)}
                    >
                      <circle r="16" fill="transparent" />
                      {on && <circle r={asIcon ? 13 : 9} className="geo__dot-pulse" />}
                      {asIcon ? (
                        <>
                          <circle r="11" className="geo__ic-bg" />
                          <Icon x={-7} y={-7} width={14} height={14} strokeWidth={2.1} className="geo__ic" />
                        </>
                      ) : (
                        <circle r={on ? 5.5 : 3.5} className="geo__dot-core" />
                      )}
                      {p.anchor && !on && (
                        <text
                          x={flip ? -15 : 15}
                          y="4"
                          textAnchor={flip ? "end" : "start"}
                          className="geo__poilabel"
                        >
                          {p.name[lang].split(" (")[0].split(" ·")[0]}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* будинок */}
                <g className="geo__home" transform={`translate(${h.x} ${h.y}) scale(${iz})`}>
                  <circle r="34" fill="url(#geo-glow)" />
                  <circle r="10" className="geo__home-ring" />
                  <circle r="5" className="geo__home-core" />
                  <text y="26" textAnchor="middle" className="geo__homelabel">
                    {t.geo.house}
                  </text>
                </g>

                {/* масштаб (лише без зуму) + північ */}
                {z === 1 && (
                  <g className="geo__scale" transform={`translate(24 ${PROJ.H - 26})`}>
                    <line x1="0" y1="0" x2="130" y2="0" />
                    <line x1="0" y1="-4" x2="0" y2="4" />
                    <line x1="130" y1="-4" x2="130" y2="4" />
                    <text x="65" y="-8" textAnchor="middle">10 km</text>
                  </g>
                )}
                <g className="geo__north" transform={`translate(${vb.x + vb.w - 34 * iz} ${vb.y + 40 * iz}) scale(${iz})`}>
                  <path d="M 0 10 L 5 -10 L 0 -4 L -5 -10 Z" />
                  <text x="0" y="26" textAnchor="middle">N</text>
                </g>
              </svg>

              {/* пігулка з відстанню — ковзає картою (CSS, без JS-анімацій) */}
              {view === "art" && (
                <div
                  className="geo__pill"
                  style={{
                    left: `${pillLeft}%`,
                    top: `${pillTop}%`,
                    transform: pillUp ? "translate(-50%, -135%)" : "translate(-50%, 40%)",
                  }}
                >
                  <b>{active.name[lang]}</b>
                  <span>
                    {active.km > 0 && <>{String(active.km).replace(".", ",")} km · </>}
                    {dist(active)}
                  </span>
                </div>
              )}

              {/* Google Maps поверх ілюстрованої карти (після згоди):
                  маршрут будинок → активний POI, режим авто/пішки */}
              {view === "map" &&
                (gmapOk ? (
                  <iframe
                    className="geo__gmap"
                    title={t.geo.views.map}
                    src={`https://maps.google.com/maps?saddr=${HOUSE.lat},${HOUSE.lon}&daddr=${active.lat},${active.lon}&dirflg=${active.mode === "foot" ? "w" : "d"}&z=${gz}&hl=${lang}&output=embed`}
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <div className="geo__consent">
                    <MapPin size={26} strokeWidth={1.6} aria-hidden="true" />
                    <p>{t.geo.gmapNote}</p>
                    <button className="btn btn--gold" onClick={() => setGmapOk(true)}>
                      {t.geo.gmapLoad}
                    </button>
                  </div>
                ))}

              {/* перемикач виду карти */}
              <div className="geo__tabs" role="tablist" aria-label={t.geo.viewsAria}>
                {(["art", "map"] as MapView[]).map((v) => (
                  <button
                    key={v}
                    role="tab"
                    aria-selected={view === v}
                    className={`geo__tab ${view === v ? "geo__tab--on" : ""}`}
                    onClick={() => setView(v)}
                  >
                    {t.geo.views[v]}
                  </button>
                ))}
              </div>

              {/* зум (працює і для ілюстрованої, і для Google) */}
              {(view === "art" || gmapOk) && (
                <div className="geo__zoom" aria-label="Zoom">
                  <button onClick={zoomIn} aria-label="+" disabled={view === "art" ? z >= 3 : gz >= 16}>
                    <Plus size={16} strokeWidth={2.2} />
                  </button>
                  <button onClick={zoomOut} aria-label="−" disabled={view === "art" ? z <= 1 : gz <= 8}>
                    <Minus size={16} strokeWidth={2.2} />
                  </button>
                </div>
              )}
            </FadeUp>
            <FadeUp delay={0.12} amount={0.2}>
              <p className="geo__hint">{view === "art" ? t.geo.hint : t.geo.gmapAttrib}</p>
            </FadeUp>
          </div>
        </div>

        {/* ── Чому ця локація — інвестиція ── */}
        <div className="geo__value">
          <FadeUp amount={0.3} className="geo__value-head">
            <h3 className="geo__value-title display">{t.geo.value.title}</h3>
          </FadeUp>
          <div className="geo__value-grid">
            {t.geo.value.cards.map((c, i) => (
              <FadeUp key={i} delay={i * 0.09} amount={0.3} className="geo__vcard">
                <span className="geo__vcard-num" aria-hidden="true">{c.n}</span>
                <h4 className="geo__vcard-h">{c.h}</h4>
                <p className="geo__vcard-p">{c.p}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
