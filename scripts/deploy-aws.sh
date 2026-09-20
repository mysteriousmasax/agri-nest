#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Build the API container and push to ECR
# Requires AWS CLI authenticated to the target account.

REPO_NAME=agri-nest-api
REGION=us-east-1
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URL="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME:latest"

echo "Building Docker image..."
docker build -f api/Dockerfile -t "$REPO_NAME:latest" api

echo "Logging in to ECR..."
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

echo "Tagging and pushing image..."
docker tag "$REPO_NAME:latest" "$ECR_URL"
docker push "$ECR_URL"

cd "$ROOT/infra/terraform/aws-ecs"
terraform init
terraform apply -var="region=$REGION" -var="db_password=agri" -auto-approve

echo "AWS deploy complete."
