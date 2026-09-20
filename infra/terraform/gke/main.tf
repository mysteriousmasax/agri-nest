terraform {
  required_providers {
    google = { source = "hashicorp/google" }
  }
}

provider "google" {
  project = var.project
  region  = var.region
}

resource "google_container_cluster" "primary" {
  name               = var.cluster_name
  location           = var.region
  remove_default_node_pool = true
  initial_node_count = 1
}

resource "google_container_node_pool" "default" {
  name       = "primary-pool"
  cluster    = google_container_cluster.primary.name
  location   = var.region
  node_count = var.node_count
  node_config {
    machine_type = var.machine_type
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}
