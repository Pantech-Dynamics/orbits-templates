import { createApp } from "./app";
import { memoryStore, postgresStore } from "./modules/notes/store";

const url = process.env.DATABASE_URL;
const postgres = url ? await postgresStore(url) : null;
const store = postgres ?? memoryStore();
if (!postgres) console.warn("DATABASE_URL isn't set: notes are kept in memory and reset on every deploy.");

const app = createApp({ store, database: postgres ? "postgres" : "memory" }).listen(Number(process.env.PORT ?? 3000));

console.log(`🦊 Elysia is running at ${app.server?.url}`);

// A redeploy stops the old container with SIGTERM: finish what's in flight, then close the database.
process.on("SIGTERM", async () => {
  await app.stop();
  await postgres?.close();
  process.exit(0);
});
