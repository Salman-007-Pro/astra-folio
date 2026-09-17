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

# k8s/Northflank sets HOSTNAME to the pod name; Next standalone binds to that.
export HOSTNAME=0.0.0.0
export PORT="${PORT:-3001}"

standalone="apps/cms/.next/standalone"
if [ -f "$standalone/apps/cms/server.js" ]; then
  mkdir -p "$standalone/apps/cms/.next"
  if [ -d apps/cms/.next/static ]; then
    rm -rf "$standalone/apps/cms/.next/static"
    cp -a apps/cms/.next/static "$standalone/apps/cms/.next/static"
  fi
  if [ -d apps/cms/public ]; then
    rm -rf "$standalone/apps/cms/public"
    cp -a apps/cms/public "$standalone/apps/cms/public"
  fi
  cd "$standalone"
  exec node apps/cms/server.js
fi

if [ -f "$standalone/server.js" ]; then
  mkdir -p "$standalone/.next"
  if [ -d apps/cms/.next/static ]; then
    rm -rf "$standalone/.next/static"
    cp -a apps/cms/.next/static "$standalone/.next/static"
  fi
  if [ -d apps/cms/public ]; then
    rm -rf "$standalone/public"
    cp -a apps/cms/public "$standalone/public"
  fi
  cd "$standalone"
  exec node server.js
fi

echo "Next standalone server.js not found under $standalone" >&2
ls -la apps/cms/.next 2>/dev/null || true
ls -la "$standalone" 2>/dev/null || true
exit 1
