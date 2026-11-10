# 12 — ECS cluster and services

The deployment brief says ECS runs separate containerized services using separate task definitions. The repository has Dockerfiles for the Gateway, Auth, Resume, Interview, Roadmap, and Billing. No ECS cluster/service/task-definition JSON or deployment export is present.

## ECS concepts in this application

- **Cluster:** logical ECS capacity/deployment boundary; launch type/capacity provider is unverified.
- **Task definition:** revisioned container specification (image, ports, resources, env/secrets, roles, logging, health checks).
- **Task:** running instantiation of a task definition.
- **Service:** maintains a desired task count, replaces failed tasks, and can integrate with an ALB target group.

| ECS service (expected mapping) | Task image/Dockerfile | Container port declaration | ALB target group |
|---|---|---:|---|
| Gateway | `backend/gateway/Dockerfile` | 8000 | Gateway target group is the stated design |
| Auth | `backend/services/auth/Dockerfile` | 8001 | Not evidenced |
| Resume | `backend/services/resume/Dockerfile` | 8002 | Not evidenced |
| Interview | `backend/services/interview/Dockerfile` | 8003 | Not evidenced |
| Roadmap | `backend/services/roadmap/Dockerfile` | 8004 | Not evidenced |
| Billing | `backend/services/billing/Dockerfile` | 8005 | Not evidenced |

CPU/memory, desired counts, roles, deployment circuit breakers, health checks, launch type, and service autoscaling cannot be identified from application source. ECS maintains task count only according to actual service desired count and placement/capacity configuration.

See [13-ecs-task-definitions.md](13-ecs-task-definitions.md) and [diagrams/ecs-microservices.mmd](diagrams/ecs-microservices.mmd).
