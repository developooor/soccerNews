import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { load } from "cheerio";
const json = async (name) =>
  JSON.parse(await readFile(`src/data/mocks/${name}.json`, "utf8"));
const [articles, teams, matches, standings] = await Promise.all(
  ["articles", "teams", "matches", "standings"].map(json),
);
const unique = (items, key) =>
  assert.equal(
    new Set(items.map((x) => x[key])).size,
    items.length,
    `Duplicate ${key}`,
  );
for (const items of [articles, teams, matches]) unique(items, "id");
unique(articles, "slug");
unique(teams, "slug");
assert.equal(articles.filter((a) => a.category !== "Guides").length, 20);
assert.equal(articles.filter((a) => a.category === "USMNT").length, 5);
assert.equal(articles.filter((a) => a.category === "Guides").length, 5);
assert.equal(teams.length, 10);
assert.equal(matches.length, 20);
const ids = new Set(teams.map((t) => t.id));
for (const a of articles) {
  assert(a.demo);
  assert(a.sections.length >= 3);
  assert(a.sections.every((s) => s.text.length > 100));
  assert(a.teamIds.every((id) => ids.has(id)));
  assert(Number.isFinite(Date.parse(a.publishedAt)));
  unique(a.sections, "id");
}
for (const m of matches) {
  assert(m.demo);
  assert(ids.has(m.homeTeamId) || m.homeTeamId === "usmnt");
  assert(ids.has(m.awayTeamId) || m.awayTeamId === "demo-opponent");
  assert.notEqual(m.homeTeamId, m.awayTeamId);
  assert(Number.isFinite(Date.parse(m.date)));
  if (m.status === "finished") {
    assert(Number.isInteger(m.homeScore));
    assert(Number.isInteger(m.awayScore));
  } else {
    assert.equal(m.homeScore, null);
    assert.equal(m.awayScore, null);
  }
}
for (const conference of ["Eastern", "Western"]) {
  const rows = standings.filter((s) => s.conference === conference);
  assert.equal(rows.length, 5);
  unique(rows, "position");
  unique(rows, "teamId");
  for (const s of rows) {
    assert.equal(teams.find((t) => t.id === s.teamId)?.conference, conference);
    assert.equal(s.played, s.wins + s.draws + s.losses);
    assert.equal(s.points, s.wins * 3 + s.draws);
  }
}
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(`${dir}/${e.name}`) : `${dir}/${e.name}`,
      ),
    )
  ).flat();
}
const htmls = (await walk("dist")).filter((p) => p.endsWith(".html"));
assert.equal(htmls.length, 42);
const titles = new Set(),
  descriptions = new Set();
let links = 0;
for (const file of htmls) {
  const $ = load(await readFile(file, "utf8"));
  assert.equal($("h1").length, 1, file);
  assert.equal($("main").length, 1);
  assert.equal($("html").attr("lang"), "en");
  const title = $("title").text(),
    desc = $('meta[name="description"]').attr("content");
  assert(title && desc);
  assert(!titles.has(title), `Duplicate title ${file}`);
  assert(!descriptions.has(desc), `Duplicate description ${file}`);
  titles.add(title);
  descriptions.add(desc);
  assert.equal($('meta[name="robots"]').attr("content"), "noindex, nofollow");
  assert($('link[rel="canonical"]').attr("href")?.startsWith("https://"));
  assert($('meta[property="og:title"]').length);
  assert($('meta[name="twitter:card"]').length);
  assert($(".demo-bar").text().includes("DEMO"));
  for (const img of $("img").toArray()) {
    assert($(img).attr("alt") !== undefined);
    assert($(img).attr("width"));
    assert($(img).attr("height"));
  }
  for (const script of $('script[type="application/ld+json"]').toArray()) {
    const schema = JSON.parse($(script).text());
    assert(schema["@type"]);
    assert(schema["@context"]);
  }
  for (const a of $("a[href]").toArray()) {
    const href = $(a).attr("href");
    if (!href || (!href.startsWith("/") && !href.startsWith("#"))) continue;
    const url = new URL(
      href,
      "https://demo.example" + file.slice(4).replace(/index.html$/, ""),
    );
    const target = url.pathname.endsWith("/")
      ? "dist" + url.pathname + "index.html"
      : "dist" + url.pathname;
    await stat(target);
    if (url.hash) {
      const dest = load(await readFile(target, "utf8"));
      assert(
        dest(`[id="${decodeURIComponent(url.hash.slice(1))}"]`).length,
        `Missing anchor ${href} in ${file}`,
      );
    }
    links++;
  }
}
assert((await readFile("dist/robots.txt", "utf8")).includes("Disallow: /"));
assert(
  !(await walk("dist")).some((f) => /sitemap.*\.xml$/.test(f)),
  "Demo URLs must not appear in a sitemap",
);
console.log(
  `PASS: 25 articles, 10 teams, 20 matches, 10 standings rows; ${htmls.length} HTML pages; ${links} internal links and anchors; metadata, JSON-LD, demo indexing safeguards.`,
);
