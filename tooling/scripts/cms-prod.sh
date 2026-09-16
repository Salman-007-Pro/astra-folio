#!/bin/sh
set -eu
pnpm cms:migrate
exec pnpm cms:start
