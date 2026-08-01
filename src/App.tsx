import { lazy, Suspense, useState } from "react";
import { useLenis } from "./lib/useLenis";
import { ContactModalProvider } from "./lib/contactModal";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import ContactModal from "./components/ContactModal";
import Nav from "./components/Nav";
import Hero from "./components/sections/Hero";
import GeoSection from "./components/sections/GeoSection";
import Tour from "./components/sections/Tour";
import Moments from "./components/sections/Moments";
import Abschluss from "./components/sections/Abschluss";
import FooterSec from "./components/sections/FooterSec";

/* Рум-тур (three.js) — окремий чанк, вантажиться при наближенні до секції */
const PanoTour = lazy(() => import("./components/three/PanoTour"));

export default function App() {
  const [ready, setReady] = useState(false);
  useLenis();

  return (
    <ContactModalProvider>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <ContactModal />
      <main>
        <Hero ready={ready} />
        <Suspense fallback={<div style={{ minHeight: "60svh", background: "var(--bg)" }} />}>
          <PanoTour />
        </Suspense>
        <GeoSection />
        <Tour />
        <Moments />
        <Abschluss />
      </main>
      <FooterSec />
    </ContactModalProvider>
  );
}
