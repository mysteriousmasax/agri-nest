terraform {
  required_providers {
    aws = { source = "hashicorp/aws" }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_ecr_repository" "api" {
  name = "agri-nest-api"
}

resource "aws_ecs_cluster" "main" {
  name = "agri-nest-staging-cluster"
}

# Note: Task definition and service are placeholders — fill in container definitions and VPC config per environment.
