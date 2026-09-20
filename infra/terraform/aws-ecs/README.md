# AWS ECS Terraform Staging Module

This folder contains Terraform configuration for a staging deployment on AWS ECS Fargate.

What it provisions:
- VPC with public subnets
- Postgres RDS instance
- ECR repository for the API image
- ECS cluster and Fargate service
- Application Load Balancer with HTTP listener
- Security groups for ALB and ECS

Usage:
```bash
cd infra/terraform/aws-ecs
tterraform init
terraform apply -var='region=us-east-1' -var='db_password=agri'
```

Deployment helper:
```bash
scripts/deploy-aws.sh
```

Notes:
- This is a staging scaffold. Tighten security groups before production.
- In production, use private subnets, NAT gateways, and encrypted RDS storage.
