output "alb_dns_name" {
  value = aws_lb.app.dns_name
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}

output "db_endpoint" {
  value = aws_db_instance.postgres.address
}
