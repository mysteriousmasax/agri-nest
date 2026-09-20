#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Build and push the Docker image to GCR, then deploy via Terraform.
# Requires gcloud auth configured and the project set.

PROJECT_ID=${PROJECT_ID:-"your-gcp-project"}
REGION=${REGION:-"us-central1"}
IMAGE="gcr.io/$PROJECT_ID/agri-nest-api:latest"

if [ "$PROJECT_ID" = "your-gcp-project" ]; then
  echo "Please set PROJECT_ID environment variable before running."
  exit 1
fi

echo "Building Docker image..."
docker build -f api/Dockerfile -t "$IMAGE" api

echo "Pushing image to GCR..."
docker push "$IMAGE"

cd "$ROOT/infra/terraform/gke"
terraform init
terraform apply -var="project=$PROJECT_ID" -var="region=$REGION" -var="image=$IMAGE" -auto-approve

echo "GKE deploy complete."
