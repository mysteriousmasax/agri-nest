variable "project" {
  type = string
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "cluster_name" {
  type    = string
  default = "agri-nest-gke-staging"
}

variable "machine_type" {
  type    = string
  default = "e2-medium"
}

variable "node_count" {
  type    = number
  default = 1
}

variable "image" {
  type    = string
  default = "gcr.io/${var.project}/agri-nest-api:latest"
}

variable "namespace" {
  type    = string
  default = "agri-nest"
}
