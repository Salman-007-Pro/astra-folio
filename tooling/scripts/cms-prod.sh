#!/bin/sh
set -eu
if [ -z "${DATABASE_URL:-}" ]; then
  if [ -n "${POSTGRES_URI:-}" ]; then
    export DATABASE_URL="$POSTGRES_URI"
  elif [ -n "${POSTGRES_URL:-}" ]; then
    export DATABASE_URL="$POSTGRES_URL"
  else
    uri="$(printenv | awk -F= '/POSTGRES_URI=/ {print $2; exit}')"
    if [ -n "$uri" ]; then
      export DATABASE_URL="$uri"
    fi
  fi
fi
if ! pnpm cms:migrate; then
  echo "cms:migrate failed. If logs say type/table already exists, reset the Northflank Postgres addon and restart." >&2
  exit 1
fi
exec pnpm cms:start
