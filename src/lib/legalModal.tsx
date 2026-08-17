/* eslint-disable react-refresh/only-export-components */
/**
 * Контекст правових модалок: Impressum і Datenschutzerklärung.
 * Живе окремо, бо політику відкривають із двох місць — футер і
 * галочка згоди у формі (в тому числі всередині спливаючої форми).
 */
import { createContext, useContext, useState, type ReactNode } from "react";

export type LegalDoc = "impressum" | "datenschutz";

const Ctx = createContext<{
  doc: LegalDoc | null;
  open: (doc: LegalDoc) => void;
  close: () => void;
}>({ doc: null, open: () => {}, close: () => {} });

export function LegalModalProvider({ children }: { children: ReactNode }) {
  const [doc, setDoc] = useState<LegalDoc | null>(null);
  const open = (d: LegalDoc) => setDoc(d);
  const close = () => setDoc(null);
  return <Ctx.Provider value={{ doc, open, close }}>{children}</Ctx.Provider>;
}

export function useLegalModal() {
  return useContext(Ctx);
}
