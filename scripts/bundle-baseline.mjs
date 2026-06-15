import fs from "node:fs";
import path from "node:path";
import {gzipSync} from "node:zlib";

const DIST_DIR = "dist";
const INDEX_HTML = path.join(DIST_DIR, "index.html");
const ASSETS_DIR = path.join(DIST_DIR, "assets");
const REPORT_PATH = "reports/bundle-baseline.json";

const formatKb = (bytes) => `${(bytes / 1024).toFixed(2)} kB`;

const getGzipSize = (buffer) => gzipSync(buffer).length;

const getInitialAssetNames = () => {
  if (!fs.existsSync(INDEX_HTML)) {
    return [];
  }

  const html = fs.readFileSync(INDEX_HTML, "utf8");
  const scriptMatch = html.match(/<script[^>]+src="\/assets\/([^"]+)"/);
  const preloadMatches = [...html.matchAll(/modulepreload[^>]+href="\/assets\/([^"]+)"/g)];

  return [
    scriptMatch?.[1],
    ...preloadMatches.map((match) => match[1]),
  ].filter(Boolean);
};

const collectAssetStats = () => {
  if (!fs.existsSync(ASSETS_DIR)) {
    throw new Error("dist/assets not found. Run `npm run build` first.");
  }

  return fs.readdirSync(ASSETS_DIR)
    .map((fileName) => {
      const filePath = path.join(ASSETS_DIR, fileName);
      const buffer = fs.readFileSync(filePath);
      const raw = buffer.length;
      const gzip = getGzipSize(buffer);

      return {
        file: fileName,
        raw,
        gzip,
        rawLabel: formatKb(raw),
        gzipLabel: formatKb(gzip),
        type: path.extname(fileName).slice(1) || "unknown",
      };
    })
    .sort((a, b) => b.raw - a.raw);
};

const summarize = (assets) => {
  const jsAssets = assets.filter((asset) => asset.type === "js");
  const cssAssets = assets.filter((asset) => asset.type === "css");
  const fontAssets = assets.filter((asset) => asset.type === "ttf");
  const initialAssetNames = new Set(getInitialAssetNames());
  const initialAssets = assets.filter((asset) => initialAssetNames.has(asset.file));

  const sum = (items, key) => items.reduce((total, item) => total + item[key], 0);

  return {
    generatedAt: new Date().toISOString(),
    assetCount: assets.length,
    js: {
      count: jsAssets.length,
      raw: sum(jsAssets, "raw"),
      gzip: sum(jsAssets, "gzip"),
    },
    css: {
      count: cssAssets.length,
      raw: sum(cssAssets, "raw"),
      gzip: sum(cssAssets, "gzip"),
    },
    fonts: {
      count: fontAssets.length,
      raw: sum(fontAssets, "raw"),
      gzip: sum(fontAssets, "gzip"),
    },
    initial: {
      count: initialAssets.length,
      raw: sum(initialAssets, "raw"),
      gzip: sum(initialAssets, "gzip"),
      files: initialAssets.map((asset) => asset.file),
    },
    initialJsGzip: sum(initialAssets.filter((asset) => asset.type === "js"), "gzip"),
    largestJs: jsAssets[0] ?? null,
    assets,
  };
};

const printSummary = (summary) => {
  console.log("\nBundle baseline");
  console.log("================");
  console.log(`Assets: ${summary.assetCount}`);
  console.log(`JS total: ${formatKb(summary.js.raw)} raw / ${formatKb(summary.js.gzip)} gzip (${summary.js.count} files)`);
  console.log(`Initial load: ${formatKb(summary.initial.raw)} raw / ${formatKb(summary.initial.gzip)} gzip (${summary.initial.count} files)`);
  console.log(`Initial JS gzip: ${formatKb(summary.initialJsGzip)}`);
  console.log(`CSS total: ${formatKb(summary.css.raw)} raw / ${formatKb(summary.css.gzip)} gzip (${summary.css.count} files)`);
  console.log(`Fonts total: ${formatKb(summary.fonts.raw)} raw (${summary.fonts.count} files)`);

  if (summary.largestJs) {
    console.log(`Largest JS chunk: ${summary.largestJs.file} (${summary.largestJs.rawLabel} raw / ${summary.largestJs.gzipLabel} gzip)`);
  }

  console.log("\nTop assets:");
  summary.assets.slice(0, 10).forEach((asset) => {
    console.log(`- ${asset.file}: ${asset.rawLabel} raw / ${asset.gzipLabel} gzip`);
  });
};

const main = () => {
  const assets = collectAssetStats();
  const summary = summarize(assets);

  fs.mkdirSync("reports", {recursive: true});
  fs.writeFileSync(REPORT_PATH, JSON.stringify(summary, null, 2));

  printSummary(summary);
  console.log(`\nSaved: ${REPORT_PATH}`);
};

main();
