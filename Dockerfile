# Payload CMS only. The Astro site stays on ChatGPT Sites.
FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

FROM base AS build
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps ./apps
COPY packages ./packages
COPY content ./content
COPY tooling ./tooling
ENV NEXT_TELEMETRY_DISABLED=1
ENV PAYLOAD_SECRET=build-only-placeholder-secret-32chars
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @garden/cms build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
COPY --from=build /app /app
RUN sed -i 's/\r$//' tooling/scripts/cms-prod.sh && chmod +x tooling/scripts/cms-prod.sh
EXPOSE 3001
CMD ["sh", "tooling/scripts/cms-prod.sh"]
