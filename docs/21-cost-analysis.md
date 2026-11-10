# 21 — Cost analysis

No AWS bill, resource sizing, traffic profile, or account configuration is included, so this is a cost-driver review rather than a dollar estimate.

| Cost area | Application driver | Practical control |
|---|---|---|
| ECS compute | Six independently running containers/services; CPU/memory and task count unknown | Right-size from metrics; scale services independently; avoid idle excess tasks |
| ALB | Hourly and capacity-unit charges | Monitor utilization and avoid unnecessary listener/rule complexity |
| CloudFront | Data transfer and request volume | Cache static frontend assets; avoid unsafe caching of authenticated API data |
| ECR | Stored image layers and transfer | Lifecycle policies for obsolete tags; avoid retaining unlimited build images |
| ElastiCache | Node class, count, and uptime | Right-size from memory/CPU/eviction/latency; determine required HA before selecting topology |
| External LLM | Token volume and model choice | Track calls/tokens/latency; limit prompt size and duplicate work |
| External APIs | YouTube and Razorpay usage | Monitor quotas and failed/repeated requests |
| MongoDB | Hosting, storage, backup, transfer | Hosting and retention are unknown; measure indexes, storage, and backup needs |

Establish per-service resource and request metrics before changing capacity. Evaluate total cost against latency and reliability requirements; do not add infrastructure solely for architectural complexity.
