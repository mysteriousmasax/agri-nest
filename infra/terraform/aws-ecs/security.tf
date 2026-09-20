resource "aws_security_group" "ecs_service" {
  name        = "agri-nest-ecs-sg"
  description = "Allow HTTP traffic to ECS service"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = var.app_container_port
    to_port     = var.app_container_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "alb" {
  name        = "agri-nest-alb-sg"
  description = "Allow HTTP to the ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
