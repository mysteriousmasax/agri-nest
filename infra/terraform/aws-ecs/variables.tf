variable "region" {
  type    = string
  default = "us-east-1"
}

variable "cluster_name" {
  type    = string
  default = "agri-nest-cluster"
}

variable "app_name" {
  type    = string
  default = "agri-nest-app"
}

variable "db_username" {
  type = string
  default = "agri"
}

variable "db_password" {
  type = string
  default = "agri"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_count" {
  type    = number
  default = 2
}

variable "app_container_port" {
  type    = number
  default = 3000
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}
