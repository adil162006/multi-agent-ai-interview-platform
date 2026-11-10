# 11 — Security groups

The project brief states two groups: an ALB security group and an ECS application security group. No actual rules are checked in, so the table below is a recommended least-privilege model, **not an inventory of deployed rules**.

| Source | Destination | Port/protocol | Purpose | Status |
|---|---|---|---|---|
| Approved clients / CloudFront origin path | ALB SG | Listener port; HTTP/HTTPS as configured | Client/origin entry | Actual ports and source ranges unverified |
| ALB SG | Gateway task SG | Gateway container port (Dockerfile declares 8000) | Forward requests to gateway | Recommended scoped ingress |
| Gateway task SG | Backend task SGs | Declared service ports 8001–8005 as needed | Internal proxy traffic | Recommended; network discovery unverified |
| Authorized application task SGs | Redis SG | Redis listener (commonly 6379; verify endpoint/config) | Sessions and caches | Restrict source to required tasks |
| Task SGs | External endpoints | Required egress destinations/ports | LLM, identity, payment, resource APIs | Egress method/policy unverified |

Separate ALB and ECS groups allow backend ingress to reference the ALB group rather than exposing task ports broadly. Verify that only intended sources can reach the ALB, ECS ingress is restricted appropriately, and Redis accepts only authorized application traffic. Group rules are stateful; still inspect both ingress and egress policy.

See [diagrams/security-groups.mmd](diagrams/security-groups.mmd). Do not copy this recommended matrix as a claim about current AWS rules.
