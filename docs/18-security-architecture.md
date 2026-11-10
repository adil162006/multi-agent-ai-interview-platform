# 18 — Security architecture

## Controls visible in source

- Gateway CORS allows the configured `FRONTEND_URL` and credentials.
- Login verifies Firebase ID tokens with Firebase Admin.
- Session IDs are random UUIDs stored in Redis with a seven-day expiry.
- Session cookie is `httpOnly`, `secure`, `SameSite=None`, and has a seven-day max age.
- Protected gateway routes validate the Redis session and pass the associated user ID to services.
- Billing verifies Razorpay signatures using HMAC-SHA256.
- `.gitignore` excludes environment files and `backend/serviceAcountKey.json`.

These source-level controls do not prove AWS network isolation, IAM, TLS at every hop, managed-secret use, or protection of deployed data.

## Risks and recommendations

1. Ensure backend task endpoints are not publicly reachable; `x-user-id` is an internal identity header and is not sufficient authentication if a service is directly exposed.
2. Verify ALB SG ingress and ECS SG ingress references; Redis should accept traffic only from application workloads that require it.
3. Use a secret manager for Firebase, LLM, payment, and database credentials; inspect images, logs, build context, and deployment history for accidental secret inclusion.
4. Verify HTTPS separately from browser to CloudFront and CloudFront to ALB. Prevent CloudFront caching of authenticated dynamic responses unless user isolation is proven.
5. Configure Redis authentication/TLS and review session TTL and cookie domain/path behavior in the live deployment.
6. Review authorization checks and validation at the service boundary, plus rate limiting/abuse controls and safe error responses.

No resource IDs, secret values, or real AWS rules are available to establish more specific findings. See [11-security-groups.md](11-security-groups.md) and [22-aws-well-architected-review.md](22-aws-well-architected-review.md).
