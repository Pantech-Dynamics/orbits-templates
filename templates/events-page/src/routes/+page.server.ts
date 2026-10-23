import { fail } from "@sveltejs/kit";
import { add, CAPACITY, count } from "#lib/server/rsvps.ts";
import type { Actions, PageServerLoad } from "./$types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Not prerendered: the places left and the "happening now" marker are worked out per request.
export const load: PageServerLoad = () => ({ placesLeft: CAPACITY - count(), now: new Date().toISOString() });

export const actions: Actions = {
  rsvp: async ({ request }) => {
    const form = await request.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    if (!name || name.length > 100) return fail(422, { name, email, error: "Tell us your name." });
    if (!EMAIL.test(email)) return fail(422, { name, email, error: "That doesn't look like an email address." });
    const result = await add(name, email);
    if (result === "full") return fail(409, { name, email, error: "The free places have all gone. A standard ticket still gets you in." });
    return { done: true, name, already: result === "already" };
  },
};
