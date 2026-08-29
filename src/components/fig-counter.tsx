'use client';

import { createContext, useContext, useRef } from 'react';

const FigCounterContext = createContext<{ next: () => number } | null>(null);

export function FigCounterProvider({ children }: { children: React.ReactNode }) {
  const counter = useRef(0);
  const next = () => {
    counter.current += 1;
    return counter.current;
  };
  return <FigCounterContext.Provider value={{ next }}>{children}</FigCounterContext.Provider>;
}

export function useFigCounter() {
  const ctx = useContext(FigCounterContext);
  if (!ctx) throw new Error('useFigCounter must be used inside FigCounterProvider');
  return ctx;
}
