# 17 — API documentation

All frontend API calls use the configured `VITE_BACKEND_URL` and Axios `withCredentials: true`. The following paths are gateway-facing; the backend routers are mounted at their service root.

| Method | Gateway path | Behavior |
|---|---|---|
| `GET` | `/` | Gateway status JSON |
| `POST` | `/api/auth/login` | Verify Firebase token, create/find user and Redis session |
| `POST` | `/api/auth/logout` | Delete session and clear cookie |
| `POST` | `/api/auth/use-coins` | Deduct user interview credits |
| `POST` | `/api/auth/add-coins` | Add credits |
| `GET` | `/api/me` | Return gateway-authenticated session user |
| `GET` | `/api/resume/` | Get user's analyzed resume |
| `POST` | `/api/resume/` | Upload PDF as multipart field `resume`, analyze it |
| `POST` | `/api/interview/start` | Start an interview (`type`, `role`, optional resume data) |
| `POST` | `/api/interview/answer` | Submit an answer (`interviewId`, `answer`) |
| `GET` | `/api/interview/all` | List interviews and computed summary |
| `GET` | `/api/interview/:id` | Retrieve an interview |
| `POST` | `/api/roadmap/generate` | Generate roadmap (`role`, `targetPackage`, optional resume) |
| `GET` | `/api/roadmap/all` | List roadmaps |
| `GET` | `/api/roadmap/:id` | Retrieve one roadmap |
| `POST` | `/api/billing/create` | Create Razorpay order (`planId`) |
| `POST` | `/api/billing/verify` | Verify order/payment/signature |

Gateway session middleware applies to resume, interview, roadmap, billing and `/api/me`. Auth paths bypass that middleware; individual auth handlers may validate their own session as needed. Authenticated gateway proxies forward `x-user-id`. Exact request/response schemas and all validation are defined in route/controller code; no OpenAPI specification exists.

See [04-gateway-and-routing.md](04-gateway-and-routing.md) for forwarding behavior. Do not treat `x-user-id` as trusted if backend services can be reached directly from untrusted networks.
