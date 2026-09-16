#!/bin/sh
set -eu
if [ -z "${DATABASE_URL:-}" ]; then
  if [ -n "${POSTGRES_URI:-}" ]; then
    export DATABASE_URL="$POSTGRES_URI"
  elif [ -n "${POSTGRES_URL:-}" ]; then
    export DATABASE_URL="$POSTGRES_URL"
  fi
fi
pnpm cms:migrate
exec pnpm cms:start
