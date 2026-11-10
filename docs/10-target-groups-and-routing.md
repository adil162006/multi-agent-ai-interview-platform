# 10 — Target groups and routing

## Routing boundary

The stated AWS path has the ALB route incoming backend traffic to the Gateway target group. Application-level route selection then occurs in Express:

| Prefix | Destination |
|---|---|
| `/api/auth` | `AUTH_SERVICE_URL` |
| `/api/resume` | `RESUME_SERVICE_URL` |
| `/api/interview` | `INTERVIEW_SERVICE_URL` |
| `/api/roadmap` | `ROADMAP_SERVICE_URL` |
| `/api/billing` | `BILLING_SERVICE_URL` |
| `/api/me` | Handled in the gateway |

The gateway service URLs are environment configuration; their concrete values are not in source. No Nginx configuration or service-specific ALB target groups are evidenced.

## AWS target-group facts to verify

For the gateway target group, inspect target type, port/protocol, health-check path and matcher, deregistration delay, registered task IPs/instances, and healthy-target count. ECS service load-balancer integration and container port mapping must agree with the target group. Do not assume the `EXPOSE 8000` declaration alone establishes that mapping.

Recommended separation is an ALB target group for the gateway entry tier; the gateway can use private service DNS or configured internal endpoints for backend calls. The actual service discovery method remains unverified.
