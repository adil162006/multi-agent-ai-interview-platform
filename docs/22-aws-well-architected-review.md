# 22 — AWS Well-Architected review

This assessment is constrained by repository source and the stated deployment model; it is not an account-level audit.

| Pillar | Evidence / current state | Gaps and risks | Practical next steps |
|---|---|---|---|
| Operational Excellence | Services are separated and gateway/service logs use console output; gateway uses Morgan | No IaC, runbooks, alarms, tracing, deployment pipeline, or incident procedures in repo | Version infrastructure; standardize structured logs/request IDs; define deploy/rollback and operational playbooks |
| Security | Firebase token verification; Redis-backed sessions; secure/HTTP-only cookie; Razorpay HMAC verification; env files ignored | AWS IAM/network/TLS/secrets unverified; direct service exposure and trust of `x-user-id` are deployment risks | Verify private tasks, least-privilege SGs/IAM, managed secrets, TLS per hop, image scanning, dependency updates |
| Reliability | MongoDB is the persistence layer; Redis session TTL and cache invalidation exist | DB/Redis HA/backups, ECS task count/AZs, health checks, rollback, dependency timeouts unverified | Validate backups/failover; multi-AZ placement as required; health checks, alarms, deploy circuit breaker, bounded timeouts |
| Performance Efficiency | Redis caches resume/roadmap/interview data; services can be scaled separately | Cache TTL/invalidation inconsistent; no capacity or latency metrics; synchronous LLM calls | Measure end-to-end latency and cache hit rates; size tasks from load; review stale cache and provider concurrency |
| Cost Optimization | Separate images/services permit independent sizing | No resource sizing, schedules, ECR lifecycle, CloudFront cache policy, or spend data | Right-size with telemetry, clean old images, cache static assets, set budgets/usage alerts and LLM token tracking |
| Sustainability | Containerized services can be right-sized and independently scaled | No utilization data or evidence of scaling-to-demand | Reduce idle capacity, use measured right-sizing and efficient request/cache behavior |

The strongest immediate priorities are confirming network boundaries and TLS/secrets, then adding operational telemetry and verifying database/Redis recovery and ECS health/deployment policies. See individual infrastructure reviews for details.

