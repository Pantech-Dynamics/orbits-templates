"use client";

import { useSyncExternalStore } from "react";
import type { Line } from "./products";

// The cart lives in the browser. The server only ever sees slugs and quantities, and prices them itself.

const KEY = "cart";
const listeners = new Set<() => void>();
const EMPTY: Line[] = [];
let lines: Line[] | null = null;

function read(): Line[] {
  if (lines) return lines;
  try {
    lines = JSON.parse(localStorage.getItem(KEY) ?? "[]") as Line[];
  } catch {
    lines = [];
  }
  return lines;
}

function write(next: Line[]) {
  lines = next.filter((l) => l.quantity > 0);
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Keeps working for this page.
  }
  listeners.forEach((l) => l());
}

export function useCart() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      const onStorage = (e: StorageEvent) => {
        if (e.key === KEY) {
          lines = null;
          l();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(l);
        window.removeEventListener("storage", onStorage);
      };
    },
    read,
    () => EMPTY,
  );
}

export function add(slug: string, quantity = 1) {
  const current = read();
  const found = current.find((l) => l.slug === slug);
  write(found ? current.map((l) => (l.slug === slug ? { ...l, quantity: Math.min(l.quantity + quantity, 20) } : l)) : [...current, { slug, quantity }]);
}

export function setQuantity(slug: string, quantity: number) {
  write(read().map((l) => (l.slug === slug ? { ...l, quantity: Math.min(Math.max(quantity, 0), 20) } : l)));
}

export const clear = () => write([]);
