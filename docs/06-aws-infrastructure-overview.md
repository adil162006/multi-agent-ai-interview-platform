# 06 — AWS infrastructure overview

## Stated deployment architecture

The supplied deployment description names a VPC, ECR, ECS cluster/services/tasks, ALB, separate ALB and ECS security groups, ElastiCache Redis OSS, CloudFront, and HTTPS. It describes the ALB as forwarding to the Gateway, which routes requests to backend services.

## Repository evidence

The repository includes Dockerfiles for the gateway and auth, billing, interview, resume, and roadmap services. It does not contain CloudFormation, CDK, Terraform, ECS task definitions, ECR commands/workflows, ALB configuration, VPC/subnet definitions, security-group rules, CloudFront configuration, ACM certificates, or ElastiCache settings.

Therefore exact ECS CPU/memory, environment injection, IAM roles, health checks, desired counts, deployment parameters, target groups, ports, network paths, TLS policies, and autoscaling are **unverified**. Do not treat the requested AWS architecture as proof of the deployed settings.

## Component roles

| AWS component | Intended role in this application | Verification status |
|---|---|---|
| VPC | Network boundary for application resources | Stated; topology/routing unverified |
| ECR | Store built service container images | Stated; repositories/tags/permissions unverified |
| ECS | Run container tasks and maintain service desired state | Stated; task definitions/services unverified |
| ALB | Receive backend traffic and forward to Gateway targets | Stated; listeners/rules/health checks unverified |
| Security groups | Control ALB, task, and Redis network access | Two groups stated; actual rules unverified |
| ElastiCache Redis OSS | Managed Redis endpoint for sessions/cache | Stated; auth/TLS/failover unverified |
| CloudFront | Edge distribution and HTTPS viewer endpoint | Stated; origins/behaviors/protocols unverified |

See [07-vpc-and-networking.md](07-vpc-and-networking.md), [08-cloudfront-and-https.md](08-cloudfront-and-https.md), [12-ecs-cluster-and-services.md](12-ecs-cluster-and-services.md), and [diagrams/aws-infrastructure.mmd](diagrams/aws-infrastructure.mmd).
