/**
 * PanoTour — інтерактивний рум-тур, розворот на два блоки:
 *  ЛІВОРУЧ — в'юер: тягнеш кадр і «роззираєшся», зум колесом/кнопками,
 *            стрічка ракурсів кімнати знизу (у кожній кімнаті 3-6 фото);
 *  ПРАВОРУЧ — великий інтерактивний план: перемикач поверхів (пігулка
 *            їде layoutId-анімацією), кросфейд плану, точки кімнат
 *            з підписами, чипи кімнат поверху, план на весь екран.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, ChevronLeft, ChevronRight, Plus, Minus, Maximize, Maximize2, X } from "lucide-react";
import Img from "../Img";
import { FadeUp } from "../ux/Reveal";
import { useT } from "../../lib/i18n";

/* ── Кімнати: ракурси за фото-каталогом, точки — за кресленнями ── */
type RoomId =
  | "vorhof" | "wohnen" | "essen" | "kueche" | "schlafen"
  | "bad" | "atelier" | "fitness" | "elw" | "garten";
type FloorId = "kg" | "eg" | "og" | "dg";

type Room = {
  id: RoomId;
  floor: FloorId;
  hfov: number;
  map: { x: number; y: number }; // частки ОБРІЗАНОГО плану (plan-crop-*)
  views: string[];
};

const ROOMS: Room[] = [
  { id: "vorhof", floor: "eg", hfov: 104, map: { x: 0.071, y: 0.49 },
    views: ["still-012", "still-011", "bergstr22-0167", "still-018", "bergstr22-0214", "bergstr22-0171"] },
  { id: "wohnen", floor: "eg", hfov: 98, map: { x: 0.565, y: 0.69 },
    views: ["bergstr22-0116", "bergstr22-0119", "bergstr22-0109", "bergstr22-0107"] },
  { id: "essen", floor: "eg", hfov: 98, map: { x: 0.653, y: 0.29 },
    views: ["bergstr22-0124", "bergstr22-0144", "bergstr22-0128", "bergstr22-0131"] },
  { id: "kueche", floor: "eg", hfov: 96, map: { x: 0.518, y: 0.24 },
    views: ["bergstr22-0140", "bergstr22-0138", "bergstr22-0147", "bergstr22-0146"] },
  { id: "schlafen", floor: "og", hfov: 96, map: { x: 0.313, y: 0.62 },
    views: ["bergstr22-0062", "bergstr22-0066", "schlafzimmer-1-og", "schlafzimmer-2-visualisiert-og", "schlafzimmer-3-visualisiert-og", "bergstr22-0034"] },
  { id: "bad", floor: "og", hfov: 94, map: { x: 0.3, y: 0.21 },
    views: ["bergstr22-0067", "bergstr22-0069", "bergstr22-0059", "bergstr22-0061", "bergstr22-0101", "bergstr22-0075"] },
  { id: "atelier", floor: "dg", hfov: 98, map: { x: 0.565, y: 0.45 },
    views: ["bergstr22-0026", "bergstr22-0030", "atelier-visualisiert-dg"] },
  { id: "fitness", floor: "kg", hfov: 96, map: { x: 0.7, y: 0.63 },
    views: ["bergstr22-0086", "bergstr22-0083"] },
  { id: "elw", floor: "kg", hfov: 94, map: { x: 0.334, y: 0.63 },
    views: ["schlafzimmer-4-visualisiert-ug", "bergstr22-0076"] },
  { id: "garten", floor: "eg", hfov: 106, map: { x: 0.865, y: 0.54 },
    views: ["still-010", "still-032-2", "still-019", "still-034", "still-020", "still-040-kopie"] },
];

const FLOORS: FloorId[] = ["dg", "og", "eg", "kg"];
const PLAN_SRC: Record<FloorId, string> = {
  kg: "/media/plan-crop-kg.webp", eg: "/media/plan-crop-eg.webp",
  og: "/media/plan-crop-og.webp", dg: "/media/plan-crop-dg.webp",
};
/* співвідношення сторін обрізаних планів — для точного вписування */
const PLAN_AR: Record<FloorId, number> = { kg: 1.022, eg: 1.43, og: 1.315, dg: 1.646 };

const R = 10;
const FOV_MIN = 36, FOV_MAX = 66, FOV_BASE = 52;
const d2r = (d: number) => (d * Math.PI) / 180;

type LookState = {
  yaw: number; pitch: number; fov: number;
  yawT: number; pitchT: number; fovT: number;
  hfov: number; vfov: number; interacted: boolean;
};

function CameraRig({ look }: { look: React.MutableRefObject<LookState> }) {
  const { camera } = useThree();
  useFrame((state, dt) => {
    const s = look.current;
    if (!s.interacted) s.yawT = Math.sin(state.clock.elapsedTime * 0.22) * 5;
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / state.size.height;
    const maxV = (2 * Math.atan(Math.tan(d2r(s.hfov - 5) / 2) / aspect) * 180) / Math.PI;
    s.fovT = THREE.MathUtils.clamp(s.fovT, FOV_MIN, Math.min(FOV_MAX, maxV, s.vfov - 2));
    const camV = cam.fov;
    const camH = (2 * Math.atan(Math.tan(d2r(camV) / 2) * aspect) * 180) / Math.PI;
    const maxYaw = Math.max(0, (s.hfov - camH) / 2 - 1);
    const maxPitch = Math.max(0, (s.vfov - camV) / 2 - 1);
    s.yawT = THREE.MathUtils.clamp(s.yawT, -maxYaw, maxYaw);
    s.pitchT = THREE.MathUtils.clamp(s.pitchT, -maxPitch, maxPitch);

    s.yaw = THREE.MathUtils.damp(s.yaw, s.yawT, 6, dt);
    s.pitch = THREE.MathUtils.damp(s.pitch, s.pitchT, 6, dt);
    s.fov = THREE.MathUtils.damp(s.fov, s.fovT, 6, dt);

    cam.rotation.order = "YXZ";
    cam.rotation.y = -d2r(s.yaw);
    cam.rotation.x = d2r(s.pitch);
    if (Math.abs(cam.fov - s.fov) > 0.01) {
      cam.fov = s.fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

function CurvedPhoto({
  texture,
  hfov,
  look,
}: {
  texture: THREE.Texture;
  hfov: number;
  look: React.MutableRefObject<LookState>;
}) {
  const geo = useMemo(() => {
    const img = texture.image as { width: number; height: number };
    const theta = d2r(hfov);
    const height = R * theta * (img.height / img.width);
    const g = new THREE.CylinderGeometry(R, R, height, 72, 1, true, Math.PI - theta / 2, theta);
    g.scale(-1, 1, 1);
    look.current.vfov = (2 * Math.atan(height / 2 / R) * 180) / Math.PI;
    look.current.hfov = hfov;
    return g;
  }, [texture, hfov, look]);

  return (
    <mesh geometry={geo}>
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.FrontSide} />
    </mesh>
  );
}

export default function PanoTour() {
  const { t } = useT();
  const hostRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewsRowRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  /* рендер-цикл WebGL живе ЛИШЕ коли секція на/біля екрана */
  const [visible, setVisible] = useState(false);
  const [roomId, setRoomId] = useState<RoomId>("vorhof");
  const [viewIdx, setViewIdx] = useState(0);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [fading, setFading] = useState(false);
  const [mapFloor, setMapFloor] = useState<FloorId>("eg");
  const [planOpen, setPlanOpen] = useState(false);
  /* точки на плані пульсують, поки користувач не клікнув жодну */
  const [dotTried, setDotTried] = useState(false);
  const [isFs, setIsFs] = useState(false);

  const room = ROOMS.find((r) => r.id === roomId)!;
  const roomIdx = ROOMS.indexOf(room);
  const names = t.pano.rooms as Record<RoomId, string>;
  const currentSlug = room.views[viewIdx] ?? room.views[0];

  const look = useRef<LookState>({
    yaw: 0, pitch: 0, fov: FOV_BASE,
    yawT: 0, pitchT: 0, fovT: FOV_BASE,
    hfov: room.hfov, vfov: 60, interacted: false,
  });

  /* монтування біля в'юпорта */
  useEffect(() => {
    const el = hostRef.current;
    if (!el || mounted) return;
    let done = false;
    const activate = () => {
      if (!done) {
        done = true;
        setMounted(true);
        cleanup();
      }
    };
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight + 700 && r.bottom > -700) activate();
    };
    const io = new IntersectionObserver(([e]) => e.isIntersecting && activate(), { rootMargin: "700px" });
    io.observe(el);
    window.addEventListener("scroll", check, { passive: true });
    const cleanup = () => {
      io.disconnect();
      window.removeEventListener("scroll", check);
    };
    check();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  /* текстури */
  const cache = useRef(new Map<string, THREE.Texture>());
  const loadTex = useCallback((slug: string) => {
    return new Promise<THREE.Texture>((resolve, reject) => {
      const hit = cache.current.get(slug);
      if (hit) return resolve(hit);
      new THREE.TextureLoader().load(
        `/media/${slug}-2800.webp`,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 4;
          cache.current.set(slug, tex);
          resolve(tex);
        },
        undefined,
        reject
      );
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let alive = true;
    loadTex(currentSlug).then((tex) => {
      if (alive) setTexture(tex);
    });
    room.views.slice(1, 3).forEach((s) => loadTex(s).catch(() => {}));
    const next = ROOMS[(roomIdx + 1) % ROOMS.length];
    loadTex(next.views[0]).catch(() => {});
    return () => {
      alive = false;
    };
  }, [mounted, currentSlug, room, roomIdx, loadTex]);

  const resetLook = (fovFrom: number) => {
    look.current.yaw = 0; look.current.yawT = 0;
    look.current.pitch = 0; look.current.pitchT = 0;
    look.current.fov = fovFrom; look.current.fovT = FOV_BASE;
  };

  const goTo = useCallback(
    (to: RoomId) => {
      if (fading || to === roomId) return;
      setFading(true);
      look.current.fovT = FOV_MIN + 2;
      const target = ROOMS.find((r) => r.id === to)!;
      Promise.all([loadTex(target.views[0]), new Promise((r) => setTimeout(r, 420))]).then(([tex]) => {
        setRoomId(to);
        setViewIdx(0);
        setMapFloor(target.floor);
        setTexture(tex as THREE.Texture);
        resetLook(FOV_MAX);
        setTimeout(() => setFading(false), 40);
      });
    },
    [fading, roomId, loadTex]
  );

  const goView = useCallback(
    (i: number) => {
      if (fading || i === viewIdx) return;
      setFading(true);
      loadTex(room.views[i]).then((tex) => {
        setViewIdx(i);
        setTexture(tex);
        resetLook(FOV_BASE + 8);
        setTimeout(() => setFading(false), 40);
      });
    },
    [fading, viewIdx, room, loadTex]
  );

  /* drag + wheel */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let dragging = false;
    let px = 0, py = 0;
    const down = (e: PointerEvent) => {
      dragging = true;
      look.current.interacted = true;
      px = e.clientX; py = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const s = look.current;
      const k = s.fov / 600;
      s.yawT -= (e.clientX - px) * k;
      s.pitchT += (e.clientY - py) * k;
      px = e.clientX; py = e.clientY;
    };
    const up = () => (dragging = false);
    /* зум — лише кнопками (+/−): колесо всюди гортає сторінку */
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [mounted]);

  const zoom = (dir: 1 | -1) => {
    look.current.interacted = true;
    look.current.fovT = THREE.MathUtils.clamp(look.current.fovT - dir * 7, FOV_MIN, FOV_MAX);
  };

  const toggleFs = () => {
    const el = hostRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };
  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  /* активна мініатюра ракурсу завжди в видимій зоні стрічки */
  useEffect(() => {
    const row = viewsRowRef.current;
    const btn = row?.querySelector<HTMLElement>(".pano__thumb.active");
    if (!row || !btn) return;
    row.scrollTo({
      left: btn.offsetLeft - row.clientWidth / 2 + btn.clientWidth / 2,
      behavior: "smooth",
    });
  }, [viewIdx, roomId]);

  const floorRooms = ROOMS.filter((r) => r.floor === mapFloor);
  const floorInfo = t.estate.floors.find((f) => f.id === mapFloor);

  /* напрям «ліфта»: вгору чи вниз їдемо між поверхами */
  const prevFloorIdx = useRef(FLOORS.indexOf(mapFloor));
  const dir = FLOORS.indexOf(mapFloor) - prevFloorIdx.current; // <0 = вище
  useEffect(() => {
    prevFloorIdx.current = FLOORS.indexOf(mapFloor);
  }, [mapFloor]);

  /* пауза WebGL поза екраном: інакше канвас тягне GPU під час усього
     скролу сторінки (включно з hero) */
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    /* миттєва синхронна оцінка (IO може віддати перший колбек із запізненням) */
    const r = el.getBoundingClientRect();
    setVisible(r.top < window.innerHeight + 160 && r.bottom > -160);
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: "160px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="pano-sec" id="plans">
      <div className="container">
        <div className="shead">
          <FadeUp>
            <span className="kicker">{t.pano.kicker}</span>
            <h2 className="shead__title display">{t.pano.title}</h2>
            <p className="lead">{t.pano.text}</p>
          </FadeUp>
        </div>
      </div>

      <div className="container">
        <div className="pano-grid">
          {/* ═══ В'ЮЕР ═══ */}
          <div className={`pano ${isFs ? "pano--fs" : ""}`} ref={hostRef}>
            <div className="pano__stage" ref={wrapRef} data-cursor="hand">
              {mounted && texture ? (
                <Canvas
                  dpr={[1, 1.75]}
                  camera={{ position: [0, 0, 0.01], fov: FOV_BASE }}
                  gl={{ antialias: true, powerPreference: "high-performance" }}
                  frameloop={visible ? "always" : "never"}
                >
                  <CameraRig look={look} />
                  <CurvedPhoto texture={texture} hfov={room.hfov} look={look} />
                </Canvas>
              ) : (
                <div className="estate__loading" aria-hidden="true" />
              )}
              <div className={`pano__veil ${fading ? "on" : ""}`} aria-hidden="true" />
              <div className="pano__vig" aria-hidden="true" />
            </div>

            <div className="pano__topleft">
              <button className="pano__ctl" onClick={() => zoom(1)} aria-label="Zoom in"><Plus size={17} /></button>
              <button className="pano__ctl" onClick={() => zoom(-1)} aria-label="Zoom out"><Minus size={17} /></button>
              <button className="pano__ctl" onClick={toggleFs} aria-label="Vollbild">
                {isFs ? <X size={17} /> : <Maximize size={16} />}
              </button>
            </div>

            {/* ракурси */}
            {room.views.length > 1 && (
              <div className="pano__views">
                <span className="pano__views-label">
                  {t.pano.angles} · {viewIdx + 1}/{room.views.length}
                </span>
                <div className="pano__views-row" ref={viewsRowRef}>
                  {room.views.map((v, i) => (
                    <button
                      key={v}
                      className={`pano__thumb ${i === viewIdx ? "active" : ""}`}
                      onClick={() => goView(i)}
                      aria-label={`${names[roomId]} ${i + 1}`}
                    >
                      <Img slug={v} alt="" sizes="96px" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pano__bar">
              <button
                className="pano__ctl"
                onClick={() => goTo(ROOMS[(roomIdx - 1 + ROOMS.length) % ROOMS.length].id)}
                aria-label="Zurück"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="pano__name">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roomId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {names[roomId]}
                  </motion.span>
                </AnimatePresence>
                <i>{String(roomIdx + 1).padStart(2, "0")} / {String(ROOMS.length).padStart(2, "0")}</i>
              </div>
              <button
                className="pano__ctl"
                onClick={() => goTo(ROOMS[(roomIdx + 1) % ROOMS.length].id)}
                aria-label="Weiter"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <span className="pano__hint">{t.pano.hint}</span>
          </div>

          {/* ═══ ПЛАН-ПАНЕЛЬ ═══ */}
          <aside className="planpanel">
            {/* підказка: точки на плані клікабельні */}
            <div className="planpanel__hint" aria-hidden="true">
              <span>{t.pano.planHint}</span>
              <ArrowDown size={15} strokeWidth={2} />
            </div>
            <div className="planpanel__body">
              {/* Перемикач-«будиночок»: бічний розріз, активний поверх висувається */}
              <div className="floorstack" role="tablist" aria-label="Etage">
                <span className="floorstack__roof" aria-hidden="true" />
                {FLOORS.map((f) => {
                  const info = t.estate.floors.find((x) => x.id === f)!;
                  const active = mapFloor === f;
                  return (
                    <motion.button
                      key={f}
                      role="tab"
                      aria-selected={active}
                      className={`floorstack__slab ${active ? "active" : ""} ${f === "kg" ? "floorstack__slab--base" : ""}`}
                      onClick={() => setMapFloor(f)}
                      animate={{ x: active ? 14 : 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    >
                      <span className="floorstack__windows" aria-hidden="true">
                        <i /><i /><i />
                      </span>
                      <b>{info.label}</b>
                      <span className="floorstack__name">{info.name}</span>
                    </motion.button>
                  );
                })}
                <span className="floorstack__ground" aria-hidden="true" />
              </div>

              <div className="planpanel__plan">
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                  <motion.div
                    key={mapFloor}
                    custom={dir}
                    className="planpanel__fit"
                    variants={{
                      enter: (d: number) => ({ opacity: 0, y: d < 0 ? -34 : 34, scale: 0.98 }),
                      center: { opacity: 1, y: 0, scale: 1 },
                      exit: (d: number) => ({ opacity: 0, y: d < 0 ? 26 : -26, scale: 0.99 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="planpanel__plan-inner" style={{ aspectRatio: PLAN_AR[mapFloor] }}>
                      <img src={PLAN_SRC[mapFloor]} alt={floorInfo?.name ?? ""} draggable={false} />
                      {floorRooms.map((r, i) => (
                        <motion.button
                          key={r.id}
                          className={`planpanel__dot ${r.id === roomId ? "active" : ""} ${dotTried ? "" : "pulse"}`}
                          style={{ left: `${r.map.x * 100}%`, top: `${r.map.y * 100}%` }}
                          onClick={() => {
                            setDotTried(true);
                            goTo(r.id);
                          }}
                          aria-label={names[r.id]}
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.14 + i * 0.05, duration: 0.3 }}
                        >
                          <i>{names[r.id]}</i>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
                <button className="planpanel__expand" onClick={() => setPlanOpen(true)} aria-label={t.pano.openPlan}>
                  <Maximize2 size={15} />
                </button>
              </div>
            </div>

            <div className="planpanel__rooms">
              {floorRooms.length ? (
                floorRooms.map((r) => (
                  <button
                    key={r.id}
                    className={`planpanel__room ${r.id === roomId ? "active" : ""}`}
                    onClick={() => goTo(r.id)}
                  >
                    {names[r.id]}
                    <i>{r.views.length} Fotos</i>
                  </button>
                ))
              ) : (
                <span className="planpanel__empty">—</span>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* великий план */}
      <AnimatePresence>
        {planOpen && (
          <div className="legal" role="dialog" aria-modal="true" aria-label={floorInfo?.name}>
            <motion.div
              className="legal__scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPlanOpen(false)}
            />
            <motion.div
              className="estate__planbox"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
            >
              <button className="estate__planclose" onClick={() => setPlanOpen(false)} aria-label="Schließen">
                <X size={18} />
              </button>
              <img src={PLAN_SRC[mapFloor]} alt={`Grundriss ${floorInfo?.name}`} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
