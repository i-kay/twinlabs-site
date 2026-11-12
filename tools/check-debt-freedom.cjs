const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { HtmlValidate } = require("html-validate");
(async () => {
  const root = path.resolve(__dirname, "..");
  const base = process.env.QA_BASE || "http://127.0.0.1:8767";
  const origin = "https://twinlabs.studio";
  const issues = [],
    report = [];
  const pages = [
    "/",
    "/debt-freedom/",
    "/debt-freedom/support.html",
    "/debt-freedom/privacy-policy.html",
  ];
  const validator = new HtmlValidate({
    extends: ["html-validate:recommended"],
    rules: {
      "no-inline-style": "off",
      "long-title": "off",
      "doctype-style": "off",
      "void-style": "off",
    },
  });
  const browser = await chromium.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const visited = new Set();
  const titles = new Set(),
    descriptions = new Set();
  for (const url of pages) {
    const name =
      url === "/"
        ? "root"
        : url === "/debt-freedom/"
          ? "index"
          : path.basename(url, ".html");
    const file = root + (url.endsWith("/") ? url + "index.html" : url);
    const html = await validator.validateFile(file);
    if (!html.valid)
      issues.push({ name, html: html.results.flatMap((r) => r.messages) });
    for (const width of [360, 390, 1440]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        deviceScaleFactor: 1,
      });
      page.on("pageerror", (e) => issues.push({ name, error: e.message }));
      const response = await page.goto(base + url);
      if (response.status() !== 200)
        issues.push({ name, status: response.status() });
      await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
      await page.keyboard.press("Tab");
      if (
        !(await page
          .locator(".skip")
          .evaluate((e) => e === document.activeElement))
      )
        issues.push({ name, width, skipFocus: false });
      await page.keyboard.press("Enter");
      if ((await page.evaluate(() => location.hash)) !== "#main")
        issues.push({ name, width, skipLink: false });
      for (const summary of await page.locator("summary").all()) {
        await summary.focus();
        await page.keyboard.press("Enter");
        if (!(await summary.evaluate((e) => e.parentElement.open)))
          issues.push({ name, width, faqOpen: false });
        await page.keyboard.press("Space");
        if (await summary.evaluate((e) => e.parentElement.open))
          issues.push({ name, width, faqClose: false });
      }
      await page.locator("img").evaluateAll(async imgs => { for (const img of imgs) { img.loading = "eager"; await img.decode().catch(() => {}); } });
      await page.addScriptTag({ path: require.resolve("axe-core") });
      const axe = await page.evaluate(() => axe.run());
      const bad = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        images: [...document.images]
          .filter((i) => !i.complete || !i.naturalWidth)
          .map((i) => i.src),
      }));
      if (axe.violations.length || bad.overflow || bad.images.length)
        issues.push({
          name,
          width,
          axe: axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          ...bad,
        });
      await page.evaluate(() => {
        document.activeElement.blur();
        window.scrollTo(0, 0);
      });
      await page.screenshot({
        path:
          root + "/docs/verification/debt-freedom-" + name + "-" + width + ".png",
        fullPage: true,
      });
      await page
        .locator("details")
        .evaluateAll((ds) => ds.forEach((d) => (d.open = true)));
      const opened = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      if (opened.overflow) issues.push({ name, width, openFaqOverflow: true });
      const openAxe = await page.evaluate(() => axe.run());
      if (openAxe.violations.length)
        issues.push({
          name,
          width,
          openFaqAxe: openAxe.violations.map((v) => v.id),
        });
      if (width === 390 && (await page.locator("details").count()))
        await page.screenshot({
          path:
            root + "/docs/verification/debt-freedom-" + name + "-faq-open.png",
          fullPage: true,
        });
      const meta = await page.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')
          ?.content,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        og: document.querySelector('meta[property="og:url"]')?.content,
        twitter: document.querySelector('meta[name="twitter:url"]')?.content,
        robots: document.querySelector('meta[name="robots"]')?.content,
        schema: [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ].map((s) => JSON.parse(s.textContent)),
        image: document.querySelector('meta[property="og:image"]')?.content,
      }));
      if (
        meta.canonical !== origin + url ||
        meta.og !== meta.canonical ||
        meta.twitter !== meta.canonical ||
        !meta.schema.some((s) => s.url === meta.canonical || s["@graph"]?.some(n => n.url === meta.canonical))
      )
        issues.push({ name, meta });
      const policy = /privacy-policy|disclaimer/.test(url);
      if (meta.robots !== (policy ? "noindex,follow" : "index,follow"))
        issues.push({ name, robots: meta.robots });
      if (width === 360) {
        if (
          titles.has(meta.title) ||
          descriptions.has(meta.description) ||
          !meta.description
        )
          issues.push({ name, duplicateMeta: true });
        titles.add(meta.title);
        descriptions.add(meta.description);
        const shared = await page.request.get(meta.image.replace(origin, base));
        if (shared.status() !== 200)
          issues.push({ name, missingSocialImage: true });
        if (!policy) {
          for (const store of [
            "https://apps.apple.com/kr/app/id6777608452",
            "https://play.google.com/store/apps/details?id=studio.twinlabs.debtfreedom",
          ])
            if (
              !(await page
                .locator("a")
                .evaluateAll(
                  (as, url) => as.some((a) => a.href === url),
                  store,
                ))
            )
              issues.push({ name, missingStore: store });
        }
      }
      for (const href of new Set(
        await page.locator("a").evaluateAll((as) => as.map((a) => a.href)),
      )) {
        if (!href.startsWith(base) && !href.startsWith(origin)) continue;
        const dest = href.replace(origin, base);
        if (visited.has(dest)) continue;
        visited.add(dest);
        const r = await page.request.get(dest.split("#")[0]);
        if (r.status() !== 200) issues.push({ name, href, status: r.status() });
        if (new URL(dest).hash) {
          const target = await browser.newPage();
          await target.goto(dest);
          if (
            !(await target
              .locator(
                '[id="' +
                  decodeURIComponent(new URL(dest).hash.slice(1)) +
                  '"]',
              )
              .count())
          )
            issues.push({ name, href, missingAnchor: true });
          await target.close();
        }
      }
      report.push({
        name,
        width,
        axeViolations: axe.violations.length,
        expandedFaqViolations: openAxe.violations.length,
        overflow: bad.overflow,
        images: bad.images,
        keyboardFaqs: await page.locator("summary").count(),
        canonical: meta.canonical,
      });
      await page.close();
    }
  }
  const map = fs.readFileSync(root + "/sitemap.xml", "utf8");
  const urls = [...map.matchAll(new RegExp("<loc>([^<]+)</loc>", "g"))].map(
    (m) => m[1],
  );
  for (const u of urls) {
    const p = await browser.newPage();
    const r = await p.goto(u.replace(origin, base));
    if (
      r.status() !== 200 ||
      (await p.locator('link[rel="canonical"]').getAttribute("href")) !== u ||
      (await p.locator('meta[name="robots"]').getAttribute("content")) !==
        "index,follow"
    )
      issues.push({ sitemap: u });
    await p.close();
  }
  if (
    !urls.includes(origin + "/debt-freedom/") ||
    !urls.includes(origin + "/debt-freedom/support.html") ||
    urls.some((u) => /debt-freedom.*(privacy|disclaimer)/.test(u))
  )
    issues.push({ sitemap: "scope" });
  const robots = fs.readFileSync(root + "/robots.txt", "utf8");
  if (
    !robots.includes("Allow: /") ||
    !robots.includes("Sitemap: " + origin + "/sitemap.xml")
  )
    issues.push({ robots: "invalid" });
  await browser.close();
  fs.writeFileSync(
    root + "/docs/verification/debt-freedom-check.json",
    JSON.stringify(
      {
        base,
        report,
        checkedInternalLinks: visited.size,
        sitemap: urls,
        issues,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify(
      { pages: report.length, checkedInternalLinks: visited.size, issues },
      null,
      2,
    ),
  );
  process.exitCode = issues.length ? 1 : 0;
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
