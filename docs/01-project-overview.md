# 01 — Project overview

InterviewAI is a React application backed by an Express gateway and five separately containerized Node.js services. It supports login, resume analysis, interview practice, skill roadmaps, and billing.

## Technology

| Layer | Observed technology |
|---|---|
| Frontend | React, Vite, React Router, Redux Toolkit, Axios |
| Backend | Node.js ES modules, Express, Mongoose |
| AI orchestration | LangChain and LangGraph in interview and roadmap workflows |
| LLM | `ChatGroq`, configured for model `openai/gpt-oss-120b` |
| Cache/session | Redis through `ioredis` |
| Data | MongoDB via Mongoose |
| Identity | Firebase Admin token verification |
| Integrations | YouTube Data API and Razorpay |
| Containers | One Dockerfile each for the gateway and five services |

The AWS deployment brief names CloudFront, ALB, ECS, ECR, VPC/security groups, and ElastiCache Redis OSS. These deployment resources are not represented by infrastructure-as-code in this repository.

## Architecture summary

The browser sends API calls to the gateway base URL. The gateway proxies each API prefix to a backend service. It validates sessions for protected prefixes using Redis and forwards `x-user-id` to downstream services. The services perform their own persistence and integration work. See [02-system-architecture.md](02-system-architecture.md) and [03-microservices-architecture.md](03-microservices-architecture.md).

## Evidence boundary

Dockerfile `EXPOSE` values are documented as declared container ports, not proof of ECS mappings or live listeners. AWS topology, subnet/AZ placement, TLS configuration, IAM, task sizes/counts, load-balancer rules, and monitoring must be checked in the deployed account. No AWS resource identifiers, IPs, CIDRs, or credential values are inferred here.
