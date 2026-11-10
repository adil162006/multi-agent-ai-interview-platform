# 19 — Monitoring and troubleshooting

## Observability evidence

Application code uses console logging and Morgan's `dev` format in the gateway. Redis connection errors are logged. No CloudWatch log-group, ECS logging driver, alarms, dashboards, tracing, or metric configuration is included in the repository. The existence of CloudWatch integration must be verified in task definitions and AWS.

## Diagnostic guide

| Symptom | Check first | Likely investigation |
|---|---|---|
| ECS task fails to start | ECS service events and stopped-task reason | Image URI/tag, ECR permissions via execution role, startup command, missing env/secrets, port/bind configuration, memory |
| ECR image pull failure | Task stopped reason and ECR image | Repository/tag/digest, execution role, network egress/VPC endpoint, registry permissions |
| Gateway target unhealthy | Target health reason, task logs | Target port vs task mapping, health path, listener/bind address, SG path, startup readiness |
| ALB 502/503 | ALB access logs/metrics, target health | 502: target reset/protocol/timeout; 503: no healthy/registered targets or no matching usable target |
| Gateway route error | Gateway logs and configured service URL | Missing/malformed URL, DNS/service discovery, downstream connection, proxy route |
| Service communication failure | Source/destination task logs and network path | SG rules, DNS, service URL, port mapping, task health |
| Redis connection failure | Client logs, endpoint status/metrics | `REDIS_URL`, DNS, port, SG/subnets, TLS/auth mismatch; session middleware returns 500 on thrown error |
| CloudFront origin error | Distribution monitoring and ALB logs | Origin DNS/availability, origin protocol policy, ALB listener/certificate, SG/origin reachability |
| HTTPS/certificate issue | CloudFront/ALB certificate and browser details | Certificate status/hostname/region requirement, listener/origin TLS configuration, viewer protocol policy |
| Agent/model failure | Service logs, provider status and latency | LLM credentials, quota, timeout, malformed JSON/model output, prompt/input size |
| YouTube resource missing | Roadmap service logs and API response | API key/quota/network; resource agent can return empty resources |

Correlate a client request with gateway and service logs using a request ID (not currently evidenced). Avoid logging tokens, cookies, full resumes, payment secrets, or private user content. See [diagrams/request-lifecycle.mmd](diagrams/request-lifecycle.mmd).
