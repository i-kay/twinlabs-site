const fs = require("fs");
const cp = require("child_process");
const crypto = require("crypto");
const root = require("path").resolve(__dirname, "..");
const paths = [
  "/",
  "/debt-freedom/",
  "/debt-freedom/index.html",
  "/debt-freedom/support.html",
  "/debt-freedom/privacy-policy.html",
  "/debt-freedom/assets/screenshot-debt-free-date.png",
  "/debt-freedom/assets/screenshot-priority.png",
  "/debt-freedom/assets/screenshot-add-debt.png",
  "/debt-freedom/assets/app-store-badge-ko.svg",
  "/debt-freedom/assets/google-play-badge-ko.png",
  "/debt-freedom/assets/app-icon.png",
  "/debt-freedom/assets/social.png",
  "/assets/social.png",
  "/robots.txt",
  "/sitemap.xml",
];
const results = [];
for (const [i, p] of paths.entries()) {
  const body = "/tmp/df-public-" + i;
  const headers = "/tmp/df-public-" + i + ".headers";
  const status = cp.execFileSync(
    "curl",
    [
      "-fsSL",
      "--max-time",
      "20",
      "-D",
      headers,
      "-o",
      body,
      "-w",
      "%{http_code}",
      "https://twinlabs.studio" + p,
    ],
    { encoding: "utf8" },
  );
  const h = fs.readFileSync(headers, "utf8");
  const file = root + (p.endsWith("/") ? p + "index.html" : p);
  const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
  results.push({
    path: p,
    status: Number(status),
    xRobotsTag: h.split(/\r?\n/).filter((l) => /^x-robots-tag:/i.test(l)),
    contentMatches: hash(fs.readFileSync(body)) === hash(fs.readFileSync(file)),
  });
}
fs.writeFileSync(
  root + "/docs/verification/debt-freedom-public.json",
  JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2),
);
console.log(JSON.stringify(results, null, 2));
if (
  results.some(
    (r) =>
      r.status !== 200 ||
      !r.contentMatches ||
      r.xRobotsTag.some((t) => /noindex|none/i.test(t)),
  )
)
  process.exitCode = 1;
