// Sample data, the same on every load. Replace these functions with calls to your API; the pages only use
// what they return.

export type Status = "paid" | "pending" | "refunded" | "failed";
export type Order = { id: string; customer: string; email: string; amount: number; status: Status; date: string };
export type Customer = { id: string; name: string; email: string; city: string; orders: number; spent: number; joined: string };

// A small seeded generator, so the numbers don't change between reloads.
function random(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const FIRST = ["Ada", "Chidi", "Amaka", "Tunde", "Ngozi", "Emeka", "Zainab", "Kofi", "Aisha", "Femi", "Halima", "Bayo", "Uche", "Sade", "Ifeanyi", "Yemi"];
const LAST = ["Okafor", "Adeyemi", "Bello", "Eze", "Mensah", "Ibrahim", "Okoro", "Balogun", "Nwosu", "Abubakar", "Ogunleye", "Danjuma"];
const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu", "Accra", "Nairobi"];
const STATUSES: Status[] = ["paid", "paid", "paid", "paid", "pending", "pending", "refunded", "failed"];
const DAY = 86_400_000;
const TODAY = Date.UTC(2026, 9, 23);

const rand = random(42);
const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)];

export const customers: Customer[] = Array.from({ length: 48 }, (_, i) => {
  // Every first name with three different surnames, so no two customers share a name.
  const name = `${FIRST[i % FIRST.length]} ${LAST[(i + Math.floor(i / FIRST.length) * 4) % LAST.length]}`;
  return {
    id: `cus_${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
    city: pick(CITIES),
    orders: 0,
    spent: 0,
    joined: new Date(TODAY - Math.floor(rand() * 400) * DAY).toISOString(),
  };
});

export const orders: Order[] = Array.from({ length: 900 }, (_, i) => {
  const customer = pick(customers);
  const amount = Math.round((5_000 + rand() * 145_000) / 100) * 100;
  const status = pick(STATUSES);
  if (status === "paid") {
    customer.orders += 1;
    customer.spent += amount;
  }
  return {
    id: `ord_${String(1000 + i)}`,
    customer: customer.name,
    email: customer.email,
    amount,
    status,
    date: new Date(TODAY - Math.floor(rand() * 90) * DAY - Math.floor(rand() * DAY)).toISOString(),
  };
}).sort((a, b) => b.date.localeCompare(a.date));

/** Revenue from paid orders for each of the last `days` days, oldest first. */
export function dailyRevenue(days: number) {
  const totals = new Map<string, number>();
  for (let d = days - 1; d >= 0; d--) totals.set(new Date(TODAY - d * DAY).toISOString().slice(0, 10), 0);
  for (const o of orders) {
    const day = o.date.slice(0, 10);
    if (o.status === "paid" && totals.has(day)) totals.set(day, totals.get(day)! + o.amount);
  }
  return [...totals].map(([day, total]) => ({ day, total }));
}

export function statusCounts() {
  const counts = { paid: 0, pending: 0, refunded: 0, failed: 0 } as Record<Status, number>;
  for (const o of orders) counts[o.status] += 1;
  return counts;
}

export const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
export const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
