const fs = require("fs");
const cp = require("child_process");
const crypto = require("crypto");
const root = require("path").resolve(__dirname, "..");
const paths = [
  "/",
  "/real-yield/",
  "/real-yield/index.html",
  "/real-yield/support.html",
  "/real-yield/privacy-policy.html",
  "/real-yield/disclaimer.html",
  "/real-yield/style.css",
  "/real-yield/assets/result.png",
  "/real-yield/assets/icon.png",
  "/real-yield/assets/social.png",
  "/assets/social.png",
  "/robots.txt",
  "/sitemap.xml",
];
const results = [];
for (const [i, p] of paths.entries()) {
  const body = "/tmp/ry-public-" + i;
  const headers = "/tmp/ry-public-" + i + ".headers";
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
  root + "/docs/verification/real-yield-public.json",
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
