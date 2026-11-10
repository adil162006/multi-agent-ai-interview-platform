# 20 — Scalability and high availability

## Current evidence

Services are independently containerized, enabling independent ECS service scaling if deployed as ECS services with appropriate task definitions and capacity. No desired counts, autoscaling policies, target tracking metrics, Availability Zone placement, or deployment minimum/maximum healthy percentages are included.

The request path is synchronous. LLM calls can dominate request latency and tie up service capacity. Redis is used by session checks and caches; Redis unavailability can affect authenticated gateway requests. MongoDB is the durable store, but its hosting and resilience model are unspecified.

## Design review

- Scale Gateway to match ingress and proxy throughput; scale AI-heavy Interview/Resume/Roadmap services separately based on concurrency, latency, and provider limits.
- Use ALB target health and ECS service health to replace unhealthy tasks; configure health checks that measure readiness without depending on expensive LLM calls.
- Verify task placement across multiple AZs and ALB subnet coverage; do not assume multi-AZ from ECS alone.
- Assess ElastiCache node sizing, failover mode, connection behavior, memory/eviction policy, and client reconnect behavior.
- Bound external calls and apply carefully designed retries; avoid retry storms against LLM/provider quotas.
- Consider queues only if workloads need deferred execution or burst absorption; no job queue exists today.

Actual high-availability posture cannot be scored without deployed AZ counts, task counts, database/Redis failover settings, and operational procedures.
