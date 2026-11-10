# InterviewAI technical documentation

This documentation records application behavior found in the repository and the AWS deployment model provided by the project owner. No AWS templates, account exports, task definitions, or network/security configuration are checked in. AWS settings that cannot be verified are explicitly marked **Unverified**; recommendations are separated from observed behavior.

## Documentation map

| Document | Subject |
|---|---|
| [01-project-overview.md](01-project-overview.md) | Product scope, stack, and evidence boundaries |
| [02-system-architecture.md](02-system-architecture.md) | End-to-end system and architecture diagram |
| [03-microservices-architecture.md](03-microservices-architecture.md) | Service inventory, dependencies, and ports |
| [04-gateway-and-routing.md](04-gateway-and-routing.md) | Gateway authentication, routing, and forwarding |
| [05-agentic-ai-architecture.md](05-agentic-ai-architecture.md) | LangGraph workflows, agents, LLM and request lifecycle |
| [06-aws-infrastructure-overview.md](06-aws-infrastructure-overview.md) | Stated AWS deployment model and unknowns |
| [07-vpc-and-networking.md](07-vpc-and-networking.md) | VPC concepts and network verification |
| [08-cloudfront-and-https.md](08-cloudfront-and-https.md) | CloudFront/HTTPS responsibilities and verification |
| [09-application-load-balancer.md](09-application-load-balancer.md) | ALB role and gateway target path |
| [10-target-groups-and-routing.md](10-target-groups-and-routing.md) | Target registration and routing boundary |
| [11-security-groups.md](11-security-groups.md) | Actual-vs-recommended security-group model |
| [12-ecs-cluster-and-services.md](12-ecs-cluster-and-services.md) | ECS cluster/service/task concepts and app service mapping |
| [13-ecs-task-definitions.md](13-ecs-task-definitions.md) | Container/task configuration evidence and gaps |
| [14-docker-and-ecr.md](14-docker-and-ecr.md) | Dockerfiles, images, ECR and image lifecycle |
| [15-elasticache-redis-architecture.md](15-elasticache-redis-architecture.md) | Redis sessions, caching, keys and limitations |
| [16-deployment-architecture.md](16-deployment-architecture.md) | Build-to-running-task lifecycle |
| [17-api-documentation.md](17-api-documentation.md) | Gateway API surface and downstream routes |
| [18-security-architecture.md](18-security-architecture.md) | Implemented controls, risks and recommendations |
| [19-monitoring-and-troubleshooting.md](19-monitoring-and-troubleshooting.md) | Observability evidence and diagnostic guide |
| [20-scalability-and-high-availability.md](20-scalability-and-high-availability.md) | Scaling and availability assessment |
| [21-cost-analysis.md](21-cost-analysis.md) | Cost drivers and practical controls |
| [22-aws-well-architected-review.md](22-aws-well-architected-review.md) | Six-pillar assessment |

## Diagrams

The Mermaid source diagrams are in [diagrams/](diagrams/): [complete-system-architecture.mmd](diagrams/complete-system-architecture.mmd), [aws-infrastructure.mmd](diagrams/aws-infrastructure.mmd), [vpc-networking.mmd](diagrams/vpc-networking.mmd), [cloudfront-alb-flow.mmd](diagrams/cloudfront-alb-flow.mmd), [alb-gateway-flow.mmd](diagrams/alb-gateway-flow.mmd), [security-groups.mmd](diagrams/security-groups.mmd), [ecs-microservices.mmd](diagrams/ecs-microservices.mmd), [ecr-ecs-deployment.mmd](diagrams/ecr-ecs-deployment.mmd), [redis-integration.mmd](diagrams/redis-integration.mmd), [agentic-workflow.mmd](diagrams/agentic-workflow.mmd), and [request-lifecycle.mmd](diagrams/request-lifecycle.mmd).

## Evidence conventions

- **Implemented** means visible in source code or Dockerfiles.
- **Stated deployment model** means specified in the supplied project brief, but not confirmed by AWS configuration.
- **Unverified** means the relevant AWS or runtime setting is absent from the repository.
- **Recommendation** means a best-practice action, not a claim that it is already deployed.

Do not put populated environment files, private keys, payment credentials, or service-account credentials in this documentation.
