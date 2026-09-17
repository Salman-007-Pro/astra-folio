import { cp, mkdir, access, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const source = path.join(root, "apps/web/dist"),
  destination = path.join(root, "dist");
await access(path.join(source, "index.html"));
if (path.dirname(destination) !== root || path.basename(destination) !== "dist")
  throw new Error("Refusing to clear an unexpected build output directory.");
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
console.log("Staged Astro static output in dist/.");
