import { readdir, stat, readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";
const directory = path.resolve("apps/web/dist");
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name),
      ),
    )
  ).flat();
}
const files = await walk(directory);
let js = 0,
  largest = 0,
  media = 0;
const chunks = [];
for (const file of files) {
  const bytes = (await stat(file)).size;
  if (file.endsWith(".js")) {
    const compressed = gzipSync(await readFile(file)).length;
    js += compressed;
    largest = Math.max(largest, compressed);
    chunks.push({
      file: path.basename(file),
      gzipKB: +(compressed / 1024).toFixed(1),
    });
  }
  if (/\.(glb|gltf|ktx2|hdr|exr)$/.test(file)) media += bytes;
}
const reading = await readFile(
  path.join(directory, "reading/index.html"),
  "utf8",
);
if (/World\.[^"']+\.js/.test(reading))
  throw new Error("Reading mode unexpectedly imports the WebGL world.");
console.log(
  JSON.stringify(
    {
      allJsGzipKB: +(js / 1024).toFixed(1),
      largestJsGzipKB: +(largest / 1024).toFixed(1),
      sceneAssetKB: media / 1024,
      chunks: chunks.sort((a, b) => b.gzipKB - a.gzipKB).slice(0, 8),
    },
    null,
    2,
  ),
);
if (js > 1.5 * 1024 * 1024 || media > 3 * 1024 * 1024)
  throw new Error("Static build exceeds the initial WebGL transfer budget.");
