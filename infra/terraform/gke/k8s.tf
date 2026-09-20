resource "kubernetes_namespace" "app" {
  metadata {
    name = var.namespace
  }
}

resource "kubernetes_deployment" "app" {
  metadata {
    name      = "agri-nest-app"
    namespace = kubernetes_namespace.app.metadata[0].name
    labels = {
      app = "agri-nest"
    }
  }

  spec {
    replicas = var.node_count
    selector {
      match_labels = {
        app = "agri-nest"
      }
    }
    template {
      metadata {
        labels = {
          app = "agri-nest"
        }
      }
      spec {
        container {
          image = var.image
          name  = "agri-nest"
          port {
            container_port = 3000
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "app" {
  metadata {
    name      = "agri-nest-service"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  spec {
    selector = {
      app = kubernetes_deployment.app.spec[0].template[0].metadata[0].labels.app
    }
    port {
      port        = 80
      target_port = 3000
    }
    type = "LoadBalancer"
  }
}
