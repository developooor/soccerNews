import type { APIRoute } from "astro";
import { isIndexable } from "../lib/seo/indexing";
export const GET: APIRoute = ({ site }) => {
  const indexable = isIndexable;
  return new Response(
    indexable
      ? `User-agent: *\nAllow: /\nSitemap: ${new URL("/sitemap-index.xml", site)}\n`
      : "User-agent: *\nDisallow: /\n",
    { headers: { "Content-Type": "text/plain" } },
  );
};
