# 13 — ECS task definitions

Separate per-service task definitions are the deployment model stated by the project owner. The repository's Dockerfiles identify the intended startup process and declared container port, but they are not ECS task definitions.

| Service | Dockerfile command | Declared port | CPU/memory | Env/secrets | Roles/health check |
|---|---|---:|---|---|---|
| Gateway | `npm start` | 8000 | Unverified | Service URLs, `PORT`, `FRONTEND_URL` | Unverified |
| Auth | `node src/index.js` | 8001 | Unverified | `PORT`, MongoDB, Firebase, Redis settings | Unverified |
| Resume | `node index.js` | 8002 | Unverified | `PORT`, MongoDB, LLM, Redis settings | Unverified |
| Interview | `node index.js` | 8003 | Unverified | `PORT`, MongoDB, LLM, Redis settings | Unverified |
| Roadmap | `node index.js` | 8004 | Unverified | `PORT`, MongoDB, LLM, YouTube, Redis settings | Unverified |
| Billing | `node index.js` | 8005 | Unverified | `PORT`, MongoDB, Razorpay settings | Unverified |

Use the **task execution role** for ECS agent operations such as image pulls and log delivery; use a distinct **task role** for AWS API access from application code. The repository does not establish whether either role is configured or which policies are attached. Inject secrets through an approved secret store rather than image layers or committed files.

Task-definition revisions make container image/configuration changes deployable. For safe rollout, configure container health checks, ALB target health checks where applicable, deployment rollback/circuit-breaker behavior, and sufficient capacity; verify actual settings in ECS.
