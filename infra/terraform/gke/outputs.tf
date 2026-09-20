output "cluster_endpoint" {
  value = google_container_cluster.primary.endpoint
}

output "service_ip" {
  value = kubernetes_service.app.status[0].load_balancer[0].ingress[0].ip
}
