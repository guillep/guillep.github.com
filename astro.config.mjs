import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const SERVER_PORT = 3000;
const SITE_URL = "https://guillep.github.io";

export default defineConfig({
  server: { port: SERVER_PORT },
  site: SITE_URL,
  integrations: [sitemap()],
});
