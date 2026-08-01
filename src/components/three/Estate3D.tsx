/**
 * Інтерактивний 3D-макет маєтку (стиль «архітектурна макетниця»):
 *  - обертання мишкою (OrbitControls), зум колесом, авто-обертання в idle;
 *  - explode-view: поверхи розлітаються по вертикалі (як dollhouse у Matterport);
 *  - клік/панель праворуч вибирає поверх — інші стають напівпрозорими;
 *  - геометрія відтворює реальні пропорції з грандрісів (14×10 м, тераси,
 *    балкони, басейн, кругла заїзна алея з фонтаном, подвійний гараж, сосни).
 * Канвас монтується лише коли секція у в'юпорті; жодних shadow-map —
 * тільки ContactShadows (дешево і м'яко).
 */
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Layers, X } from "lucide-react";
import Img from "../Img";
import { FadeUp } from "../ux/Reveal";
import { useT } from "../../lib/i18n";

/* ── Палітра макета ── */
const C = {
  wall: "#EDE6D6",
  wallIn: "#E7DFCC",
  slab: "#DFD6C2",
  roof: "#D9CEB8",
  glass: "#9FBCC8",
  gold: "#C4A15F",
  water: "#6FA8BC",
  plate: "#1A2133",
  path: "#3A4258",
  green: "#31513F",
  trunk: "#6B5138",
};

type FloorId = "kg" | "eg" | "og" | "dg";

/* Вертикальна розкладка поверхів (метри) */
const H = 2.55; // висота поверху
const BASE: Record<FloorId, number> = { kg: 0, eg: H, og: H * 2, dg: H * 3 };
const EXPLODE: Record<FloorId, number> = { kg: 0, eg: 1.6, og: 3.2, dg: 4.8 };

/* ═══════════════ 3D-модель ═══════════════ */

function Box({
  args,
  pos,
  color,
  mat,
  rot,
}: {
  args: [number, number, number];
  pos: [number, number, number];
  color?: string;
  mat?: THREE.Material;
  rot?: [number, number, number];
}) {
  return (
    <mesh position={pos} rotation={rot}>
      <boxGeometry args={args} />
      {mat ? <primitive object={mat} attach="material" /> : <meshStandardMaterial color={color} roughness={0.85} />}
    </mesh>
  );
}

/** Периметр стін з боксів (щоб уникнути CSG): 4 стіни + прорізи умовно */
function Perimeter({ w, d, h, mat }: { w: number; d: number; h: number; mat: THREE.Material }) {
  const t = 0.18;
  return (
    <>
      <Box args={[w, h, t]} pos={[0, h / 2, -d / 2 + t / 2]} mat={mat} />
      <Box args={[w, h, t]} pos={[0, h / 2, d / 2 - t / 2]} mat={mat} />
      <Box args={[t, h, d - t * 2]} pos={[-w / 2 + t / 2, h / 2, 0]} mat={mat} />
      <Box args={[t, h, d - t * 2]} pos={[w / 2 - t / 2, h / 2, 0]} mat={mat} />
    </>
  );
}

/** Скляна стрічка (натяк на вікна) уздовж фасаду */
function GlassStrip({ w, pos, rotY = 0 }: { w: number; pos: [number, number, number]; rotY?: number }) {
  return (
    <mesh position={pos} rotation={[0, rotY, 0]}>
      <planeGeometry args={[w, 1.35]} />
      <meshStandardMaterial color={C.glass} transparent opacity={0.5} roughness={0.25} metalness={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

function useFloorMaterials(dimmed: boolean, selected: boolean) {
  return useMemo(() => {
    const make = (color: string) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness: 0.85, transparent: true });
      return m;
    };
    const wall = make(C.wall);
    const wallIn = make(C.wallIn);
    const slab = make(C.slab);
    if (selected) {
      wall.emissive = new THREE.Color(C.gold);
      wall.emissiveIntensity = 0.12;
    }
    const op = dimmed ? 0.16 : 1;
    [wall, wallIn, slab].forEach((m) => (m.opacity = op));
    return { wall, wallIn, slab };
  }, [dimmed, selected]);
}

function Floor({
  id,
  selected,
  dimmed,
  explode,
  onPick,
  children,
  label,
}: {
  id: FloorId;
  selected: boolean;
  dimmed: boolean;
  explode: number;
  onPick: (f: FloorId) => void;
  children: (mats: ReturnType<typeof useFloorMaterials>) => React.ReactNode;
  label: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const mats = useFloorMaterials(dimmed, selected);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = BASE[id] + explode * EXPLODE[id];
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, target, 4, dt);
  });

  return (
    <group
      ref={ref}
      position={[0, BASE[id], 0]}
      onClick={(e) => {
        e.stopPropagation();
        onPick(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      {children(mats)}
      <Html position={[-7.9, 1.1, 0]} center distanceFactor={26} occlude={false}>
        <button
          className={`estate__tag ${selected ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onPick(id);
          }}
        >
          {label}
        </button>
      </Html>
    </group>
  );
}

function Villa({
  selected,
  explode,
  onPick,
  labels,
}: {
  selected: FloorId | null;
  explode: number;
  onPick: (f: FloorId) => void;
  labels: Record<FloorId, string>;
}) {
  const W = 14;
  const D = 10;
  const dim = (f: FloorId) => selected !== null && selected !== f;

  return (
    <group>
      {/* ── УГ: цоколь з окремим входом ── */}
      <Floor id="kg" selected={selected === "kg"} dimmed={dim("kg")} explode={explode} onPick={onPick} label={labels.kg}>
        {(m) => (
          <>
            <Box args={[W, 0.22, D]} pos={[0, 0.11, 0]} mat={m.slab} />
            <Perimeter w={W} d={D} h={H - 0.15} mat={m.wall} />
            {/* внутрішні стіни: кімната з ванною + фітнес + технік */}
            <Box args={[0.14, H - 0.5, D - 0.6]} pos={[-1.4, (H - 0.5) / 2, 0]} mat={m.wallIn} />
            <Box args={[W / 2 - 1.2, H - 0.5, 0.14]} pos={[-4.3, (H - 0.5) / 2, -0.8]} mat={m.wallIn} />
            <Box args={[0.14, H - 0.5, 4]} pos={[3.4, (H - 0.5) / 2, D / 2 - 2.2]} mat={m.wallIn} />
            {/* окремий вхід: золоті двері зі сходами */}
            <Box args={[1.1, 1.9, 0.1]} pos={[W / 2 - 0.04, 1.0, 1.6]} color={C.gold} />
            <Box args={[1.4, 0.18, 0.9]} pos={[W / 2 + 0.75, 0.1, 1.6]} mat={m.slab} />
          </>
        )}
      </Floor>

      {/* ── ЕГ: відкритий простір + тераси ── */}
      <Floor id="eg" selected={selected === "eg"} dimmed={dim("eg")} explode={explode} onPick={onPick} label={labels.eg}>
        {(m) => (
          <>
            <Box args={[W, 0.22, D]} pos={[0, 0.11, 0]} mat={m.slab} />
            <Perimeter w={W} d={D} h={H - 0.15} mat={m.wall} />
            {/* скляний східний фасад (сад) + південь */}
            <GlassStrip w={8.4} pos={[W / 2 - 0.05, 1.35, 0.6]} rotY={Math.PI / 2} />
            <GlassStrip w={7.5} pos={[1.8, 1.35, D / 2 - 0.05]} />
            {/* внутрішні стіни: Diele/Büro зліва, кухня-вітальня справа */}
            <Box args={[0.14, H - 0.5, D - 0.6]} pos={[-1.1, (H - 0.5) / 2, 0]} mat={m.wallIn} />
            <Box args={[3.4, H - 0.5, 0.14]} pos={[-3.2, (H - 0.5) / 2, 0.6]} mat={m.wallIn} />
            {/* кухонний острів + стіл (натяки) */}
            <Box args={[2.6, 0.5, 0.8]} pos={[2.6, 0.42, -2.9]} mat={m.wallIn} />
            <Box args={[2.2, 0.42, 1.0]} pos={[3.4, 0.38, -0.6]} color={C.gold} />
            {/* вхідні двері (захід) */}
            <Box args={[0.1, 2.0, 1.2]} pos={[-W / 2 + 0.04, 1.05, 0.4]} color={C.gold} />
          </>
        )}
      </Floor>

      {/* ── ОГ: 3 спальні + 2 балкони ── */}
      <Floor id="og" selected={selected === "og"} dimmed={dim("og")} explode={explode} onPick={onPick} label={labels.og}>
        {(m) => (
          <>
            <Box args={[W, 0.22, D]} pos={[0, 0.11, 0]} mat={m.slab} />
            <Perimeter w={W} d={D} h={H - 0.15} mat={m.wall} />
            {/* хрест внутрішніх стін: спальні по кутах */}
            <Box args={[0.14, H - 0.5, D - 0.6]} pos={[0.4, (H - 0.5) / 2, 0]} mat={m.wallIn} />
            <Box args={[W - 0.8, H - 0.5, 0.14]} pos={[0, (H - 0.5) / 2, -0.9]} mat={m.wallIn} />
            {/* балкони: схід (більший) і захід */}
            <Box args={[0.16, 0.95, 3.4]} pos={[W / 2 + 1.05, 0.6, 0.4]} mat={m.wall} />
            <Box args={[2.1, 0.16, 3.4]} pos={[W / 2 + 1.05, 0.12, 0.4]} mat={m.slab} />
            <Box args={[0.16, 0.95, 2.2]} pos={[-W / 2 - 0.75, 0.6, 0.2]} mat={m.wall} />
            <Box args={[1.5, 0.16, 2.2]} pos={[-W / 2 - 0.75, 0.12, 0.2]} mat={m.slab} />
          </>
        )}
      </Floor>

      {/* ── ДГ: ательє + вальмовий дах зі світловими вікнами ── */}
      <Floor id="dg" selected={selected === "dg"} dimmed={dim("dg")} explode={explode} onPick={onPick} label={labels.dg}>
        {(m) => (
          <>
            <Box args={[W, 0.22, D]} pos={[0, 0.11, 0]} mat={m.slab} />
            {/* коліна стін */}
            <Perimeter w={W} d={D} h={0.9} mat={m.wall} />
            {/* вальмовий дах — 4-гранна піраміда */}
            <mesh position={[0, 0.9 + 1.25, 0]} rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[Math.hypot(W, D) / 2 - 1.6, 2.5, 4]} />
              <primitive object={new THREE.MeshStandardMaterial({ color: C.roof, roughness: 0.9, transparent: true, opacity: (m.wall as THREE.MeshStandardMaterial).opacity })} attach="material" />
            </mesh>
            {/* світлові вікна */}
            <Box args={[1.5, 0.06, 1.0]} pos={[-2.4, 2.0, -2.1]} rot={[0.62, 0, 0]} color={C.glass} />
            <Box args={[1.5, 0.06, 1.0]} pos={[1.9, 2.0, -2.1]} rot={[0.62, 0, 0]} color={C.glass} />
            {/* димар каміна */}
            <Box args={[0.55, 1.7, 0.55]} pos={[-3.4, 1.8, 1.6]} mat={m.wall} />
          </>
        )}
      </Floor>
    </group>
  );
}

function Grounds() {
  const pines = useMemo(() => {
    const rng = (seed: number) => () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const r = rng(7);
    return Array.from({ length: 14 }, () => {
      const edge = r();
      const x = edge < 0.5 ? -16 + r() * 5 : 12 + r() * 6;
      const z = -10 + r() * 20;
      const s = 0.8 + r() * 1.4;
      return { x, z, s };
    });
  }, []);

  return (
    <group>
      {/* плита ділянки */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[40, 0.24, 24]} />
        <meshStandardMaterial color={C.plate} roughness={0.95} />
      </mesh>
      {/* кругла заїзна алея (захід) + фонтан */}
      <mesh position={[-10.6, 0.015, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 3.6, 48]} />
        <meshStandardMaterial color={C.path} roughness={0.9} />
      </mesh>
      <mesh position={[-10.6, 0.35, 0.4]}>
        <cylinderGeometry args={[0.75, 0.9, 0.7, 24]} />
        <meshStandardMaterial color={C.gold} roughness={0.4} metalness={0.35} />
      </mesh>
      <mesh position={[-10.6, 0.95, 0.4]}>
        <sphereGeometry args={[0.32, 20, 16]} />
        <meshStandardMaterial color={C.glass} roughness={0.2} metalness={0.2} transparent opacity={0.85} />
      </mesh>
      {/* доріжка до дому */}
      <Box args={[3.4, 0.05, 1.6]} pos={[-8.2, 0.02, 0.4]} color={C.path} />
      {/* подвійний гараж (північний захід) */}
      <group position={[-9.2, 0, -6.2]}>
        <Box args={[5.6, 2.6, 4.6]} pos={[0, 1.3, 0]} color={C.wall} />
        <Box args={[5.8, 0.2, 4.8]} pos={[0, 2.7, 0]} color={C.roof} />
        <Box args={[2.2, 1.9, 0.08]} pos={[-1.3, 1.0, 2.32]} color={C.path} />
        <Box args={[2.2, 1.9, 0.08]} pos={[1.3, 1.0, 2.32]} color={C.path} />
      </group>
      {/* тераса + басейн (схід) */}
      <Box args={[5.6, 0.14, 8.4]} pos={[9.6, 0.07, 0.4]} color={C.slab} />
      <group position={[11.3, 0, 0.4]}>
        <Box args={[6.6, 0.34, 3.9]} pos={[0, 0.17, 0]} color={C.gold} />
        <mesh position={[0, 0.37, 0]}>
          <boxGeometry args={[6.1, 0.06, 3.4]} />
          <meshStandardMaterial color={C.water} roughness={0.15} metalness={0.1} emissive={C.water} emissiveIntensity={0.25} />
        </mesh>
      </group>
      {/* вогнище */}
      <mesh position={[8.6, 0.14, 6.2]}>
        <cylinderGeometry args={[0.7, 0.8, 0.3, 20]} />
        <meshStandardMaterial color={C.path} roughness={0.9} />
      </mesh>
      <pointLight position={[8.6, 0.7, 6.2]} color="#E8A050" intensity={2.2} distance={5} />
      {/* сосни */}
      {pines.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} scale={p.s}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.09, 0.13, 1.4, 8]} />
            <meshStandardMaterial color={C.trunk} roughness={1} />
          </mesh>
          <mesh position={[0, 2.1, 0]}>
            <coneGeometry args={[0.85, 2.6, 9]} />
            <meshStandardMaterial color={C.green} roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Scene({
  selected,
  explode,
  onPick,
  labels,
  interacted,
  onInteract,
}: {
  selected: FloorId | null;
  explode: number;
  onPick: (f: FloorId) => void;
  labels: Record<FloorId, string>;
  interacted: boolean;
  onInteract: () => void;
}) {
  return (
    <>
      <ambientLight intensity={0.65} color="#FFF4E4" />
      <directionalLight position={[14, 18, 8]} intensity={1.35} color="#FFEFD8" />
      <directionalLight position={[-12, 8, -10]} intensity={0.35} color="#AFC3E8" />
      <group position={[0, 0, 0]}>
        <Villa selected={selected} explode={explode} onPick={onPick} labels={labels} />
        <Grounds />
      </group>
      <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={48} blur={2.6} far={16} resolution={512} color="#03060c" />
      <OrbitControls
        enablePan={false}
        minDistance={14}
        maxDistance={40}
        minPolarAngle={Math.PI * 0.12}
        maxPolarAngle={Math.PI * 0.46}
        autoRotate={!interacted}
        autoRotateSpeed={0.55}
        onStart={onInteract}
        makeDefault
      />
    </>
  );
}

/* ═══════════════ Секція з панеллю ═══════════════ */

export default function Estate3D() {
  const { t } = useT();
  const [selected, setSelected] = useState<FloorId | null>(null);
  const [exploded, setExploded] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  /* канвас — коли секція поруч із в'юпортом (IO + scroll-фолбек) */
  useEffect(() => {
    const el = hostRef.current;
    if (!el || mounted) return;
    let done = false;
    const activate = () => {
      if (done) return;
      done = true;
      setMounted(true);
      cleanup();
    };
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight + 700 && r.bottom > -700) activate();
    };
    const io = new IntersectionObserver(([e]) => e.isIntersecting && activate(), {
      rootMargin: "700px",
    });
    io.observe(el);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const cleanup = () => {
      io.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
    check();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const labels = useMemo(
    () =>
      Object.fromEntries(t.estate.floors.map((f) => [f.id, f.label])) as Record<FloorId, string>,
    [t]
  );
  const activeFloor = t.estate.floors.find((f) => f.id === selected);

  const pick = (f: FloorId) => {
    setSelected((cur) => (cur === f ? null : f));
    if (!exploded) setExploded(true);
  };

  return (
    <section className="estate" id="plans">
      <div className="container">
        <div className="shead">
          <FadeUp>
            <span className="kicker">{t.estate.kicker}</span>
            <h2 className="shead__title display">{t.estate.title}</h2>
            <p className="lead">{t.estate.text}</p>
          </FadeUp>
        </div>

        <div className="estate__grid">
          <div className="estate__canvas" ref={hostRef} aria-label="3D-Modell des Anwesens">
            {mounted ? (
              <Canvas
                dpr={[1, 1.75]}
                camera={{ position: [21, 13, 21], fov: 33 }}
                gl={{ antialias: true, alpha: true }}
              >
                <Suspense fallback={null}>
                  <Scene
                    selected={selected}
                    explode={exploded ? 1 : 0}
                    onPick={pick}
                    labels={labels}
                    interacted={interacted}
                    onInteract={() => setInteracted(true)}
                  />
                </Suspense>
              </Canvas>
            ) : (
              <div className="estate__loading" aria-hidden="true" />
            )}
            <span className="estate__hint">{t.estate.hint}</span>
          </div>

          <div className="estate__panel">
            <div className="estate__floors" role="tablist">
              <button
                role="tab"
                aria-selected={selected === null}
                className={`estate__floorbtn ${selected === null ? "active" : ""}`}
                onClick={() => setSelected(null)}
              >
                {t.estate.all}
              </button>
              {[...t.estate.floors].reverse().map((f) => (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={selected === f.id}
                  className={`estate__floorbtn ${selected === f.id ? "active" : ""}`}
                  onClick={() => pick(f.id as FloorId)}
                >
                  <b>{f.label}</b> {f.name}
                </button>
              ))}
            </div>

            <button className="btn btn--ghost estate__explode" onClick={() => setExploded((v) => !v)}>
              <Layers size={16} aria-hidden="true" />
              {exploded ? t.estate.collapse : t.estate.explode}
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected ?? "all"}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.16 } }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="estate__info"
              >
                {activeFloor ? (
                  <>
                    <h3 className="estate__floorname display">{activeFloor.name}</h3>
                    <ul className="estate__rooms">
                      {activeFloor.rooms.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                    <button className="estate__planlink" onClick={() => setPlanOpen(true)}>
                      {t.estate.planLabel} →
                    </button>
                  </>
                ) : (
                  <ul className="estate__rooms">
                    {t.estate.floors.map((f) => (
                      <li key={f.id}>
                        <b>{f.label}</b> — {f.name}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* лайтбокс з грандрісом */}
      <AnimatePresence>
        {planOpen && activeFloor && (
          <div className="legal" role="dialog" aria-modal="true" aria-label={activeFloor.name}>
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
              <Img slug={activeFloor.plan} alt={`Grundriss ${activeFloor.name}`} sizes="90vw" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
