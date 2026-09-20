OpenAPI Generator configs and example commands

This folder contains example configurations and commands to generate server and client stubs from `api/openapi.yaml` using the OpenAPI Generator CLI.

Requirements
- Docker (recommended) or Java + openapi-generator-cli installed

Example commands (Docker):

# Generate Node Express server stub
docker run --rm -v "%cd%":/local openapitools/openapi-generator-cli generate \
  -i /local/api/openapi.yaml -g nodejs-express-server -o /local/generated/server/nodejs-express \
  --enable-post-process-file

# Generate TypeScript axios client
docker run --rm -v "%cd%":/local openapitools/openapi-generator-cli generate \
  -i /local/api/openapi.yaml -g typescript-axios -o /local/generated/client/ts-axios

# Generate Python FastAPI server
docker run --rm -v "%cd%":/local openapitools/openapi-generator-cli generate \
  -i /local/api/openapi.yaml -g python-fastapi -o /local/generated/server/python-fastapi

Configuration files
- You can supply generator config files (JSON/YAML) to tune package names, groupIds, and output formats. See examples below.

CI automation
- A GitHub Action workflow is provided at `.github/workflows/generate-stubs.yml` which runs on `push` to `api/openapi.yaml` and on manual dispatch. It generates stubs into `generated/` and commits them back to the branch.

Local helper
- Use `scripts/generate-stubs.sh` to generate stubs locally via Docker.
