import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const base = process.env.TEST_BASE_URL || "http://localhost:4321";
const pages = [
  "/",
  "/mls/",
  "/usmnt/",
  "/mls/standings/",
  "/mls/schedule/",
  "/mls/teams/inter-miami-cf/",
  "/guides/",
  "/news/a-new-chapter-for-soccer-in-america/",
];
let checks = 0;
const axe = [];
await mkdir("test-results", { recursive: true });
try {
  for (const width of [375, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const path of pages) {
      const response = await page.goto(base + path);
      assert.equal(response.status(), 200, path);
      await page.locator("h1").waitFor();
      assert.equal(await page.locator("h1").count(), 1);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `Horizontal overflow at ${width}: ${path}`,
      );
      for (const img of await page.locator("img").all())
        await img.scrollIntoViewIfNeeded();
      await page.waitForFunction(() =>
        Array.from(document.images).every(
          (img) => img.complete && img.naturalWidth > 0,
        ),
      );
      await page.evaluate(() => window.scrollTo(0, 0));
      assert(
        await page
          .locator("img")
          .evaluateAll((imgs) =>
            imgs.every((img) => img.complete && img.naturalWidth > 0),
          ),
        `Image failed: ${path}`,
      );
      if (path === "/")
        await page.screenshot({
          path: `test-results/home-${width}.png`,
          fullPage: true,
        });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      if (results.violations.length)
        axe.push({
          width,
          path,
          violations: results.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => n.target),
          })),
        });
      checks++;
    }
    await page.goto(base + "/mls/standings/");
    await page.getByRole("tab", { name: "Western Conference" }).click();
    assert.equal(await page.locator("#west").isVisible(), true);
    assert.equal(await page.locator("#east").isVisible(), false);
    assert(
      await page
        .locator("#west")
        .innerText()
        .then((t) => t.includes("LA Galaxy")),
    );
    await page
      .getByRole("tab", { name: "Western Conference" })
      .press("ArrowLeft");
    assert.equal(await page.locator("#east").isVisible(), true);
    if (width === 375) {
      await page.goto(base + "/");
      const toggle = page.locator("#menu-toggle");
      assert.equal(await page.locator("#main-nav").isVisible(), false);
      await toggle.click();
      assert.equal(await page.locator("#main-nav").isVisible(), true);
      assert.equal(await toggle.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#main-nav").isVisible(), false);
      await toggle.click();
      await page
        .locator("#main-nav")
        .getByRole("link", { name: "MLS", exact: true })
        .click();
      assert(page.url().endsWith("/mls/"));
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  await writeFile(
    "test-results/accessibility.json",
    JSON.stringify(axe, null, 2),
  );
  assert.deepEqual(
    axe,
    [],
    "Accessibility violations; see test-results/accessibility.json",
  );
  console.log(
    `PASS: ${checks} page/viewport checks, mobile navigation, keyboard conference switching, no console errors, no WCAG A/AA axe violations.`,
  );
} finally {
  await browser.close();
}
