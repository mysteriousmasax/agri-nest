#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Generating Node Express server stub..."
docker run --rm -v "${ROOT}":/local openapitools/openapi-generator-cli generate \
  -i /local/api/openapi.yaml -g nodejs-express-server -o /local/generated/server/nodejs-express

echo "Generating TypeScript axios client..."
docker run --rm -v "${ROOT}":/local openapitools/openapi-generator-cli generate \
  -i /local/api/openapi.yaml -g typescript-axios -o /local/generated/client/ts-axios

echo "Generation complete."
