// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // The site's address, for canonical links and link previews. Set SITE_URL in Orbit's environment variables.
  site: process.env.SITE_URL,
});
