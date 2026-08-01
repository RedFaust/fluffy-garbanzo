/* eslint-disable react-refresh/only-export-components */
/**
 * Контекст спливаючої форми заявки: open("viewing" | "expose" | "call").
 */
import { createContext, useContext, useState, type ReactNode } from "react";

type ModalState = { open: boolean; interest: string };
const Ctx = createContext<{
  state: ModalState;
  open: (interest?: string) => void;
  close: () => void;
}>({ state: { open: false, interest: "viewing" }, open: () => {}, close: () => {} });

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({ open: false, interest: "viewing" });
  const open = (interest = "viewing") => setState({ open: true, interest });
  const close = () => setState((s) => ({ ...s, open: false }));
  return <Ctx.Provider value={{ state, open, close }}>{children}</Ctx.Provider>;
}

export function useContactModal() {
  return useContext(Ctx);
}
