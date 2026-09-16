function fromParts() {
  const host = process.env.PGHOST || process.env.POSTGRES_HOST;
  const password = process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD;
  if (!host || !password) return;
  const user =
    process.env.POSTGRES_USER ||
    process.env.POSTGRES_USERNAME ||
    process.env.PGUSER ||
    "postgres";
  const port = process.env.PGPORT || process.env.POSTGRES_PORT || "5432";
  const database =
    process.env.POSTGRES_DB ||
    process.env.POSTGRES_DATABASE ||
    process.env.PGDATABASE ||
    "postgres";
  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

export function databaseUrl() {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URI ||
    process.env.POSTGRES_URL ||
    fromParts();
  if (!url)
    throw new Error(
      "DATABASE_URL is missing. On Northflank, link the Postgres addon to this service and map its URI to DATABASE_URL. Do not use 127.0.0.1.",
    );
  if (
    process.env.SKIP_LOCALHOST_DB_CHECK !== "1" &&
    process.env.NEXT_PHASE !== "phase-production-build" &&
    process.env.NODE_ENV === "production" &&
    /(?:127\.0\.0\.1|localhost)/i.test(url)
  )
    throw new Error(
      "DATABASE_URL points at localhost. Use the Northflank addon internal URI (host like portfolio-cms-db), not 127.0.0.1.",
    );
  return url;
}
