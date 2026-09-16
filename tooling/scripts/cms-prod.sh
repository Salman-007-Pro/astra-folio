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
pnpm cms:migrate
exec pnpm cms:start
