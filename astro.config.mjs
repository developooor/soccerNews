import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { existsSync, readFileSync } from "node:fs";
import { loadEnvFile } from "node:process";
if (existsSync(".env")) loadEnvFile(".env");
const hasDemoContent = ["articles", "matches"].some((name) =>
  JSON.parse(
    readFileSync(
      new URL(`./src/data/mocks/${name}.json`, import.meta.url),
      "utf8",
    ),
  ).some((item) => item.demo),
);
const indexable =
  process.env.ENABLE_INDEXING === "true" &&
  process.env.CONTENT_MODE === "verified" &&
  !hasDemoContent;
export default defineConfig({
  site: process.env.SITE_URL || process.env.URL || "https://soccer-usa-news.example",
  trailingSlash: "always",
  integrations: [sitemap({ filter: () => indexable })],
  vite: { plugins: [tailwindcss()] },
});
