# 08 — CloudFront and HTTPS

The project brief states that CloudFront and HTTPS are used, but the repository contains no distribution or certificate configuration. Accordingly, the viewer protocol, origin type, origin protocol policy, cache behavior, and ACM certificate region/status are **unverified**.

## Two independent TLS connections

1. **Viewer to CloudFront:** The viewer certificate and viewer protocol policy determine how browser traffic reaches the distribution.
2. **CloudFront to origin:** The origin protocol policy determines whether the distribution connects to the ALB over HTTP or HTTPS. This is separate from viewer HTTPS.

HTTPS on the first leg does not prove HTTPS on the second. Verify the ALB listener certificate and that its hostname matches the origin configuration if origin HTTPS is required.

## API caching

The application returns authenticated, user-specific data and uses cookies for sessions. API behaviors should forward the required cookies/headers/query parameters and normally disable shared caching unless a carefully designed cache key and policy prevent cross-user data leakage. Static frontend assets can use separate cache behavior from dynamic API paths.

## Verify in AWS

Inspect distribution origins, origin path, origin protocol policy, allowed methods, cache/origin-request policies, forwarded cookies, viewer protocol policy, alternate domain names, ACM certificate, ALB listeners, and certificate coverage. No actual values are available in this repository. See [diagrams/cloudfront-alb-flow.mmd](diagrams/cloudfront-alb-flow.mmd).
