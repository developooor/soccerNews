import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("test-results", { recursive: true });
const chrome = await launch({
  chromePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  for (const [name, path] of [
    ["home", "/"],
    ["article", "/news/a-new-chapter-for-soccer-in-america/"],
  ]) {
    const result = await lighthouse(
      (process.env.TEST_BASE_URL || "http://localhost:4321") + path,
      {
        port: chrome.port,
        output: "html",
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        logLevel: "error",
      },
    );
    if (!result) throw new Error("No Lighthouse results");
    await writeFile(`test-results/lighthouse-${name}.html`, result.report);
    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories).map(([id, c]) => [
        id,
        Math.round(c.score * 100),
      ]),
    );
    await writeFile(
      `test-results/lighthouse-${name}.json`,
      JSON.stringify(
        {
          scores,
          failures: Object.entries(result.lhr.audits)
            .filter(([, a]) => a.score !== null && a.score < 1)
            .map(([id, a]) => ({
              id,
              title: a.title,
              score: a.score,
              description: a.description,
            })),
        },
        null,
        2,
      ),
    );
    console.log(name, JSON.stringify(scores));
  }
} finally {
  chrome.kill();
}
