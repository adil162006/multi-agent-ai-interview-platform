# 04 — Gateway and routing

The Express gateway is the application-level router. The ALB, in the stated AWS model, forwards incoming backend traffic to this gateway; it does not replace gateway routing.

## Implemented behavior

- Parses JSON and cookies, writes Morgan development logs, and enables credentialed CORS for `FRONTEND_URL`.
- `/` returns a gateway health-style JSON response.
- Proxies `/api/auth` to `AUTH_SERVICE_URL` without `isAuth`.
- Protects `/api/resume`, `/api/interview`, `/api/roadmap`, and `/api/billing` with `isAuth`, then proxies to the corresponding configured service URL.
- Protects `/api/me` and returns the user decoded from the Redis session.
- `proxyWithHeaders` adds `x-user-id` to downstream request headers.

`isAuth` reads the `session` cookie, fetches `session:<id>` in Redis, parses the JSON into `req.user`, and returns 401 when absent. Redis/JSON exceptions return 500.

## Routing distinction

| Layer | Responsibility | Example |
|---|---|---|
| ALB | Network-level entry/listener and target-group forwarding to gateway | Forward API traffic to gateway targets |
| Gateway | Application-level URL-prefix routing and session enforcement | `/api/interview/*` to interview service |
| Backend service | Domain behavior and route/controller execution | `POST /start` generates interview questions |

Actual ALB listener/rule/target-group configuration and gateway service URLs are unverified. Keep backend tasks private in the deployed network and permit only trusted gateway traffic where appropriate.
