import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const SITE_URL = (process.env.SITE_URL ?? '').replace(/\/$/, '')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // index.html says %SITE_URL% where link previews need the site's full address; set SITE_URL to fill it in.
    { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL) },
  ],
})
