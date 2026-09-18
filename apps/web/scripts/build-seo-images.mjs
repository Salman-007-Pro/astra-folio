import { mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const portraitFile = resolve(root, "src/assets/salman-asif-portrait.png");
const publicDir = resolve(root, "public");
const svg = await readFile(resolve(publicDir, "favicon.svg"));

await mkdir(publicDir, { recursive: true });

const portrait = sharp(portraitFile).rotate();
const { width = 960, height = 1200 } = await portrait.metadata();
const cropLeft = Math.max(0, Math.round((width - height * 0.72) / 2));
const cropWidth = Math.min(width - cropLeft, Math.round(height * 0.72));
const face = await portrait
  .extract({
    left: cropLeft,
    top: Math.round(height * 0.08),
    width: cropWidth,
    height: Math.round(height * 0.78),
  })
  .resize(560, 630, { fit: "cover", position: "attention" })
  .png()
  .toBuffer();

const card = sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: { r: 245, g: 243, b: 237 },
  },
});

const type = Buffer.from(`
  <svg width="640" height="630" xmlns="http://www.w3.org/2000/svg">
    <text x="48" y="250" font-size="22" font-family="Georgia, serif" fill="#636b62" letter-spacing="3">FULL-STACK ENGINEER</text>
    <text x="48" y="330" font-size="52" font-family="Georgia, serif" fill="#172522">Salman Asif</text>
    <text x="48" y="390" font-size="28" font-family="Georgia, serif" fill="#264dea">Thoughtful system design.</text>
    <text x="48" y="500" font-size="22" font-family="Georgia, serif" fill="#636b62">salmanasif.pro</text>
  </svg>
`);

await card
  .composite([
    { input: face, left: 0, top: 0 },
    { input: type, left: 560, top: 0 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(resolve(publicDir, "og.jpg"));

await sharp(portraitFile)
  .rotate()
  .resize(960, 1200, { fit: "cover", position: "attention" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(resolve(publicDir, "portrait.jpg"));

await sharp(svg).resize(48, 48).png().toFile(resolve(publicDir, "favicon-48.png"));
await sharp(svg)
  .resize(180, 180)
  .png()
  .toFile(resolve(publicDir, "apple-touch-icon.png"));

const og = await readFile(resolve(publicDir, "og.jpg"));
if (og.byteLength > 300_000) {
  throw new Error(`og.jpg is too large (${og.byteLength} bytes)`);
}
