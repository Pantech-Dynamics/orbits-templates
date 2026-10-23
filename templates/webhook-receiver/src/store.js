import { randomUUID } from "node:crypto";

const KEEP = 500;

/**
 * The newest events, in memory. They're gone after a restart or a redeploy: swap this file for a database
 * when you need to keep them.
 */
class EventStore {
  #items = [];
  #deliveries = new Map();

  get size() {
    return this.#items.length;
  }

  /** Senders retry, so an event whose delivery id was seen before is reported as a duplicate. */
  add({ delivery, type, payload }) {
    const seen = delivery && this.#deliveries.get(delivery);
    if (seen) return { event: seen, duplicate: true };
    const event = { id: randomUUID(), delivery, type, received_at: new Date().toISOString(), payload };
    this.#items.unshift(event);
    if (delivery) this.#deliveries.set(delivery, event);
    for (const old of this.#items.splice(KEEP)) if (old.delivery) this.#deliveries.delete(old.delivery);
    return { event, duplicate: false };
  }

  list(limit) {
    return this.#items.slice(0, Math.min(Math.max(limit, 1), 100));
  }
}

export const events = new EventStore();
