# 03 — Microservices architecture

## Service inventory

| Service | Responsibility and routes | Container port | Dependencies visible in source |
|---|---|---:|---|
| Gateway | CORS/cookies, Redis session check, API routing, `x-user-id` propagation, `/api/me` | 8000 | Redis; configured service URLs |
| Auth | Firebase ID-token verification, user records, session lifecycle, credit operations | 8001 | MongoDB, Redis, Firebase Admin |
| Resume | PDF text extraction, AI analysis, resume persistence and retrieval | 8002 | MongoDB, Redis, Groq LLM |
| Interview | Interview generation, answer feedback, summary/report, history | 8003 | MongoDB, Redis, Groq LLM, LangGraph |
| Roadmap | Roadmap generation, articles/video resources, retrieval | 8004 | MongoDB, Redis, Groq LLM, YouTube API, LangGraph |
| Billing | Razorpay order creation and signature verification | 8005 | MongoDB, Razorpay |

Ports are from Dockerfile `EXPOSE` declarations. Actual ECS host/task mappings and service discovery configuration are not checked in. Each backend service mounts its route router at `/`; the gateway adds the `/api/<service>` prefix and proxies.

## Dependencies and flow

The gateway communicates with backend services through URLs supplied in environment variables. Its authenticated proxy helper adds `x-user-id` from the Redis session. There is no direct service-to-service HTTP call visible in the inspected route/controller paths; AI and persistence calls are made within their owning service.

All service directories contain independent Dockerfiles. MongoDB connection configuration is read from `MONGODB_URL` in each service. Redis is imported from `backend/shared/redis/redis.js` by gateway and selected services.

## Nginx

No Nginx configuration or Nginx container is present in the inspected repository. The frontend is Vite/React; production static hosting and any edge web-server role are not evidenced.

## Scaling implications

The separation permits independent ECS service scaling if ECS services are configured accordingly. No desired counts, autoscaling rules, or per-service CPU/memory settings are present in source control.
