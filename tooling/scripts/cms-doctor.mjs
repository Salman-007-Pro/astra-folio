import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const envFile = path.join(root, "apps/cms/.env");
if (existsSync(envFile)) process.loadEnvFile(envFile);
const errors = [];
const required = [
  "DATABASE_URL",
  "PAYLOAD_SECRET",
  "CMS_PUBLIC_URL",
  "PUBLIC_SITE_URL",
];
for (const key of required)
  if (!process.env[key]) errors.push(`${key} is missing.`);
if (
  process.env.PAYLOAD_SECRET &&
  (process.env.PAYLOAD_SECRET.length < 32 ||
    process.env.PAYLOAD_SECRET.includes("replace-with"))
)
  errors.push(
    "PAYLOAD_SECRET needs a random value of at least 32 characters, not the example placeholder.",
  );
for (const key of ["DATABASE_URL", "CMS_PUBLIC_URL", "PUBLIC_SITE_URL"]) {
  if (!process.env[key]) continue;
  try {
    const url = new URL(process.env[key]);
    if (
      !(
        key === "DATABASE_URL"
          ? ["postgres:", "postgresql:"]
          : ["http:", "https:"]
      ).includes(url.protocol)
    )
      throw new Error();
    if (
      key !== "DATABASE_URL" &&
      (url.pathname !== "/" ||
        url.search ||
        url.hash ||
        url.username ||
        url.password)
    )
      throw new Error();
  } catch {
    errors.push(
      `${key} is not a valid ${key === "DATABASE_URL" ? "PostgreSQL connection URL" : "HTTP(S) origin"}.`,
    );
  }
}
const r2 = [
  "R2_BUCKET",
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
];
if (r2.some((key) => process.env[key]) && !r2.every((key) => process.env[key]))
  errors.push(
    "R2 requires all four R2_* variables; otherwise leave all four empty for local media storage.",
  );
if (
  Boolean(process.env.BUILD_WEBHOOK_URL) !==
  Boolean(process.env.BUILD_WEBHOOK_SECRET)
)
  errors.push(
    "Set BUILD_WEBHOOK_URL and BUILD_WEBHOOK_SECRET together, or leave both empty.",
  );
for (const key of required)
  console.log(`${key}: ${process.env[key] ? "configured" : "missing"}`);
console.log(`Media: ${process.env.R2_BUCKET ? "R2" : "local disk"}`);
console.log(
  `Rebuild hook: ${process.env.BUILD_WEBHOOK_URL ? "configured" : "manual rebuilds"}`,
);
if (errors.length) {
  errors.forEach((error) => console.error(error));
  process.exitCode = 1;
} else
  console.log(
    "Environment shape looks good. This check does not connect to PostgreSQL, test credentials, or modify data.",
  );
