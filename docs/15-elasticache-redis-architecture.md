# 15 — ElastiCache Redis architecture

The brief identifies ElastiCache for Redis OSS. Source uses a shared `ioredis` client whose URL comes from `REDIS_URL`, falling back locally to `redis://localhost:6379`. The application does not distinguish an ElastiCache deployment from another Redis endpoint; the environment variable provides the endpoint.

## Actual use cases

| Service | Keys and operations | Expiration/invalidation |
|---|---|---|
| Gateway | Reads `session:<sessionId>` for authentication | Session producer sets seven-day TTL |
| Auth | Creates, reads, updates and deletes session keys | Seven-day TTL on login and session updates; delete on logout |
| Resume | Reads/writes `resume:<userId>` | No explicit TTL at inspected call sites |
| Roadmap | Reads/writes user list and per-roadmap keys | One-hour TTL; invalidate user list when generating |
| Interview | Reads `interview:<userId>` and deletes on completed interview | TTL/write behavior not fully established from inspected calls |

Redis provides session lookup and cache acceleration. MongoDB remains the durable application store. No evidence of Redis queues, rate limiting, agent graph memory/checkpointing, or background job coordination was found.

## Connectivity and resilience

ECS-to-Redis reachability, endpoint port, subnet group, SG rules, auth token, TLS, backups, failover, and persistence settings are infrastructure configuration and unverified. The client logs connection and error events. It does not configure an explicit connection pool (ioredis manages its client connection), nor a general cache-miss fallback for Redis outages; session checks require Redis.

Review TTLs and invalidation on all writes to avoid stale cache data. In particular, resume cache writes have no explicit expiry in the inspected controller. Keep Redis access private and use TLS/authentication when supported by the deployed configuration.

See [diagrams/redis-integration.mmd](diagrams/redis-integration.mmd).
