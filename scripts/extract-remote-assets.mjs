import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const REPO_ROOT = process.cwd();
const REMOTE_PAGE_URL = "https://shenxianovo.com/SBTI.html";
const HTML_PATH = path.join(REPO_ROOT, "research/original/SBTI.html");
const GENERATED_DATA_PATH = path.join(
  REPO_ROOT,
  "src/lib/sbti-data.generated.json",
);
const IMAGE_OUTPUT_DIR = path.join(REPO_ROOT, "public/assets/original/sbti");

function extractDataFromHtml(html) {
  const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1];

  if (!script) {
    throw new Error("Unable to find inline script block in SBTI.html");
  }

  const start = script.indexOf("const dimensionMeta =");
  const end = script.indexOf("const app =");

  if (start === -1 || end === -1) {
    throw new Error("Unable to locate SBTI data block");
  }

  const block =
    script.slice(start, end) +
    "\n;globalThis.__sbtiData = { dimensionMeta, questions, specialQuestions, TYPE_LIBRARY, TYPE_IMAGES, NORMAL_TYPES, DIM_EXPLANATIONS, dimensionOrder, DRUNK_TRIGGER_QUESTION_ID };";

  const context = { globalThis: {} };
  vm.runInNewContext(block, context);
  return context.globalThis.__sbtiData;
}

function toRemoteAssetUrl(relativePath) {
  return new URL(relativePath, REMOTE_PAGE_URL).toString();
}

async function ensureHtml() {
  try {
    return await fs.readFile(HTML_PATH, "utf8");
  } catch {
    const response = await fetch(REMOTE_PAGE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch remote html: ${response.status}`);
    }
    const html = await response.text();
    await fs.mkdir(path.dirname(HTML_PATH), { recursive: true });
    await fs.writeFile(HTML_PATH, html, "utf8");
    return html;
  }
}

async function downloadImage(relativePath) {
  const fileName = path.basename(relativePath);
  const destination = path.join(IMAGE_OUTPUT_DIR, fileName);

  try {
    await fs.access(destination);
    return { fileName, skipped: true };
  } catch {
    const response = await fetchWithRetry(toRemoteAssetUrl(relativePath));
    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(destination, Buffer.from(arrayBuffer));
    return { fileName, skipped: false };
  }
}

async function fetchWithRetry(url, attempts = 4) {
  let lastError;

  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) =>
        setTimeout(resolve, 400 * Math.pow(2, index)),
      );
    }
  }

  throw lastError;
}

async function main() {
  const html = await ensureHtml();
  const data = extractDataFromHtml(html);

  await fs.mkdir(path.dirname(GENERATED_DATA_PATH), { recursive: true });
  await fs.writeFile(
    GENERATED_DATA_PATH,
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8",
  );

  await fs.mkdir(IMAGE_OUTPUT_DIR, { recursive: true });
  const imagePaths = Object.values(data.TYPE_IMAGES);
  const downloads = [];
  for (const imagePath of imagePaths) {
    downloads.push(await downloadImage(imagePath));
  }

  const downloadedCount = downloads.filter((item) => !item.skipped).length;
  console.log(
    JSON.stringify(
      {
        generatedDataPath: path.relative(REPO_ROOT, GENERATED_DATA_PATH),
        imageCount: imagePaths.length,
        downloadedCount,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
