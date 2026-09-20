#!/bin/sh
set -e

PG_HOST=${PG_HOST:-localhost}
PG_PORT=${PG_PORT:-5432}

echo "Waiting for Postgres at ${PG_HOST}:${PG_PORT}..."
while ! nc -z "$PG_HOST" "$PG_PORT"; do
  sleep 1
  echo "Waiting for Postgres..."
done

echo "Postgres is available. Running migrations..."
npm run migrate

echo "Starting API server..."
exec node api/server.js
