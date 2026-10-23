// Everything about the event, in one place. Times are ISO strings with their offset, so they're right in
// every time zone.

export const EVENT = {
  name: "Build Africa 2026",
  tagline: "Two days of talks and workshops for people who build software across the continent.",
  city: "Lagos",
  venue: "Landmark Centre, Victoria Island",
  start: "2026-11-20T09:00:00+01:00",
  end: "2026-11-21T18:00:00+01:00",
  timeZone: "Africa/Lagos",
};

export type Speaker = { id: string; name: string; role: string; bio: string };

export const SPEAKERS: Speaker[] = [
  { id: "amaka", name: "Amaka Eze", role: "CTO, Baobab", bio: "Scaled payments to forty million users without a single all-nighter, mostly." },
  { id: "kofi", name: "Kofi Mensah", role: "Staff engineer, Kinetic", bio: "Writes about databases, latency and the networks between them." },
  { id: "zainab", name: "Zainab Bello", role: "Founder, Savanna Labs", bio: "Builds offline-first apps for farmers in places the network forgets." },
  { id: "tunde", name: "Tunde Adeyemi", role: "Design lead, Lumen", bio: "Thinks every error message is a design problem in disguise." },
  { id: "ngozi", name: "Ngozi Okafor", role: "Security researcher", bio: "Breaks things for a living so they don't break for you." },
  { id: "chidi", name: "Chidi Nwosu", role: "Developer advocate, Northwind", bio: "Has given the same demo two hundred times; it still works." },
];

export type Session = { start: string; end: string; title: string; speaker?: string; room: string; kind: "talk" | "workshop" | "break" };

export const SCHEDULE: Session[] = [
  { start: "2026-11-20T09:00:00+01:00", end: "2026-11-20T09:30:00+01:00", title: "Doors open and breakfast", room: "Foyer", kind: "break" },
  { start: "2026-11-20T09:30:00+01:00", end: "2026-11-20T10:15:00+01:00", title: "Payments at the scale of a continent", speaker: "amaka", room: "Main hall", kind: "talk" },
  { start: "2026-11-20T10:30:00+01:00", end: "2026-11-20T11:15:00+01:00", title: "Your database is slower than you think", speaker: "kofi", room: "Main hall", kind: "talk" },
  { start: "2026-11-20T11:30:00+01:00", end: "2026-11-20T13:00:00+01:00", title: "Workshop: offline-first with service workers", speaker: "zainab", room: "Room 2", kind: "workshop" },
  { start: "2026-11-20T13:00:00+01:00", end: "2026-11-20T14:00:00+01:00", title: "Lunch", room: "Foyer", kind: "break" },
  { start: "2026-11-20T14:00:00+01:00", end: "2026-11-20T14:45:00+01:00", title: "Error messages people can act on", speaker: "tunde", room: "Main hall", kind: "talk" },
  { start: "2026-11-21T09:30:00+01:00", end: "2026-11-21T10:15:00+01:00", title: "How we'd break into your app", speaker: "ngozi", room: "Main hall", kind: "talk" },
  { start: "2026-11-21T10:30:00+01:00", end: "2026-11-21T12:00:00+01:00", title: "Workshop: ship an API in ninety minutes", speaker: "chidi", room: "Room 2", kind: "workshop" },
  { start: "2026-11-21T12:00:00+01:00", end: "2026-11-21T13:00:00+01:00", title: "Lunch", room: "Foyer", kind: "break" },
  { start: "2026-11-21T13:00:00+01:00", end: "2026-11-21T14:00:00+01:00", title: "Panel: building for the next billion", room: "Main hall", kind: "talk" },
  { start: "2026-11-21T17:00:00+01:00", end: "2026-11-21T18:00:00+01:00", title: "Closing drinks", room: "Rooftop", kind: "break" },
];

// Paid tiers link to wherever you sell tickets: a Paystack payment page, Flutterwave, Tix… The free tier is
// the RSVP form on the page.
export const TICKETS = [
  { name: "Community", price: "Free", blurb: "Talks on both days. Limited places.", rsvp: true },
  { name: "Standard", price: "₦45,000", blurb: "Talks, workshops, lunch both days.", href: "https://paystack.com/pay/your-page" },
  { name: "Team of five", price: "₦180,000", blurb: "Five standard tickets, one invoice.", href: "https://paystack.com/pay/your-team-page" },
];

export const speakerById = (id?: string) => SPEAKERS.find((s) => s.id === id);

const dayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: EVENT.timeZone });
const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: EVENT.timeZone });

export const formatDay = (iso: string) => dayFormat.format(new Date(iso));
export const formatTime = (iso: string) => timeFormat.format(new Date(iso));

/** The schedule grouped by day, in the event's time zone. */
export function days() {
  const groups = new Map<string, Session[]>();
  for (const s of SCHEDULE) {
    const day = formatDay(s.start);
    groups.set(day, [...(groups.get(day) ?? []), s]);
  }
  return [...groups].map(([label, sessions]) => ({ label, sessions }));
}
