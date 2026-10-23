import { EVENT } from "#lib/event.ts";

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** An iCalendar file, so "Add to calendar" works in Google, Apple and Outlook calendars. */
export const GET = () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//events-page//EN",
    "BEGIN:VEVENT",
    `UID:${stamp(EVENT.start)}-event@events-page`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(EVENT.start)}`,
    `DTEND:${stamp(EVENT.end)}`,
    `SUMMARY:${EVENT.name}`,
    `LOCATION:${EVENT.venue}\\, ${EVENT.city}`,
    `DESCRIPTION:${EVENT.tagline}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return new Response(ics, {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="event.ics"' },
  });
};
