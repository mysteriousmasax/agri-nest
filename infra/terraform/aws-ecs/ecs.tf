resource "aws_ecr_repository" "api" {
  name = "agri-nest-api"
}

resource "aws_iam_role" "ecs_task_execution" {
  name = "agri-nest-ecs-task-exec"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_assume_role.json
}

data "aws_iam_policy_document" "ecs_task_execution_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals { type = "Service"; identifiers = ["ecs-tasks.amazonaws.com"] }
  }
}

resource "aws_ecs_cluster" "main" {
  name = "agri-nest-cluster"
}

# Note: Task definition and service definitions are environment specific. Create task definitions referencing images built and pushed to ECR.
