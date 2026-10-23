import { useSyncExternalStore } from "react";

// Sign-in for the demo: one account, checked in the browser. A static site can't keep a secret, so before
// real data goes behind this, replace signIn with a call to your auth server and keep its session cookie.

export const DEMO = { email: "admin@example.com", password: "orbit" };

type User = { email: string; name: string };
const KEY = "session";
const listeners = new Set<() => void>();

function read(): User | null {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "null") as User | null;
  } catch {
    return null;
  }
}

let user = read();

function set(next: User | null) {
  user = next;
  try {
    if (next) sessionStorage.setItem(KEY, JSON.stringify(next));
    else sessionStorage.removeItem(KEY);
  } catch {
    // Stays signed in for this page only.
  }
  listeners.forEach((l) => l());
}

export function useUser() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => user,
  );
}

export async function signIn(email: string, password: string): Promise<string | null> {
  await new Promise((r) => setTimeout(r, 300));
  if (email.trim().toLowerCase() !== DEMO.email || password !== DEMO.password) return "That email and password don't match.";
  set({ email: DEMO.email, name: "Admin" });
  return null;
}

export const signOut = () => set(null);
