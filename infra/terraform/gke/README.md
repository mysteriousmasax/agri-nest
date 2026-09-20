# GKE Terraform Staging Module

This folder contains Terraform configuration for Google Kubernetes Engine staging.

What it provisions:
- GKE cluster with a managed node pool
- Kubernetes namespace, deployment, and LoadBalancer service for the API

Usage:
```bash
cd infra/terraform/gke
terraform init
terraform apply -var='project=YOUR_PROJECT' -var='region=us-central1'
```

Deployment helper:
```bash
scripts/deploy-gke.sh
```

Notes:
- Ensure `gcloud auth login` has been run and the project is set.
- The Kubernetes provider uses the generated cluster credentials.
- The app image should be available in `gcr.io/<project>/agri-nest-api:latest`.
