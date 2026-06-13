import {spawn} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(ROOT_DIR, "reports");
const PREVIEW_PORT = 4173;
const PREVIEW_URL = `http://127.0.0.1:${PREVIEW_PORT}`;

const ROUTES = [
  {id: "home", path: "/"},
  {id: "all-quizzes", path: "/allquizzes"},
];

const OPTIONAL_QUIZ_PATH = process.env.LIGHTHOUSE_QUIZ_PATH?.trim();

if (OPTIONAL_QUIZ_PATH) {
  ROUTES.push({
    id: "quiz",
    path: OPTIONAL_QUIZ_PATH.startsWith("/") ? OPTIONAL_QUIZ_PATH : `/${OPTIONAL_QUIZ_PATH}`,
  });
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runCommand = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT_DIR,
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} exited with code ${code}`));
    });
  });

const waitForPreview = async () => {
  const healthUrl = `${PREVIEW_URL}/`;
  const attempts = 30;

  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // Preview is still starting.
    }

    await wait(500);
  }

  throw new Error(`Preview server did not start at ${PREVIEW_URL}`);
};

const extractMetrics = (report) => {
  const audits = report.audits ?? {};

  return {
    performance: Math.round((report.categories?.performance?.score ?? 0) * 100),
    fcp: audits["first-contentful-paint"]?.displayValue ?? null,
    lcp: audits["largest-contentful-paint"]?.displayValue ?? null,
    tbt: audits["total-blocking-time"]?.displayValue ?? null,
    cls: audits["cumulative-layout-shift"]?.displayValue ?? null,
    speedIndex: audits["speed-index"]?.displayValue ?? null,
  };
};

const runLighthouse = async (route) => {
  const outputPath = path.join(REPORTS_DIR, `lighthouse-${route.id}.json`);
  const targetUrl = `${PREVIEW_URL}${route.path}`;

  await runCommand("npx", [
    "lighthouse",
    targetUrl,
    "--quiet",
    "--chrome-flags=--headless --no-sandbox",
    "--only-categories=performance",
    "--output=json",
    `--output-path=${outputPath}`,
  ]);

  const report = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  return {
    route: route.path,
    url: targetUrl,
    reportPath: path.relative(ROOT_DIR, outputPath).replaceAll("\\", "/"),
    metrics: extractMetrics(report),
  };
};

const printSummary = (results) => {
  console.log("\nLighthouse baseline");
  console.log("===================");
  results.forEach((result) => {
    const {metrics} = result;
    console.log(`${result.route}`);
    console.log(`  Performance: ${metrics.performance}`);
    console.log(`  FCP: ${metrics.fcp}`);
    console.log(`  LCP: ${metrics.lcp}`);
    console.log(`  TBT: ${metrics.tbt}`);
    console.log(`  CLS: ${metrics.cls}`);
    console.log(`  Speed Index: ${metrics.speedIndex}`);
  });
};

const main = async () => {
  if (!fs.existsSync(path.join(ROOT_DIR, "dist"))) {
    throw new Error("dist/ not found. Run `npm run build` first.");
  }

  fs.mkdirSync(REPORTS_DIR, {recursive: true});

  const preview = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(PREVIEW_PORT)], {
    cwd: ROOT_DIR,
    stdio: "ignore",
    shell: true,
  });

  try {
    await waitForPreview();

    const results = [];
    for (const route of ROUTES) {
      console.log(`\nRunning Lighthouse for ${route.path}...`);
      results.push(await runLighthouse(route));
    }

    const summary = {
      generatedAt: new Date().toISOString(),
      previewUrl: PREVIEW_URL,
      routes: results,
    };

    const summaryPath = path.join(REPORTS_DIR, "lighthouse-baseline.json");
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    printSummary(results);
    console.log(`\nSaved: ${path.relative(ROOT_DIR, summaryPath).replaceAll("\\", "/")}`);
  } finally {
    preview.kill("SIGTERM");
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
