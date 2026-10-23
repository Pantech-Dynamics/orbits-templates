import { createApp } from "./app";
import { taskStore } from "./tasks";

const store = taskStore(["Read the README", "Change a component in src/components", "Push and watch it deploy"]);
const app = createApp(store).listen(Number(process.env.PORT ?? 3000));

console.log(`🦊 Elysia is running at ${app.server?.url}`);

process.on("SIGTERM", async () => {
  await app.stop();
  process.exit(0);
});
