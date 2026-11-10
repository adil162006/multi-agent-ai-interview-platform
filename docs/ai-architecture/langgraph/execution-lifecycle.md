# Graph execution lifecycle

## Interview invocation

`POST /api/interview/start` → gateway session validation and `x-user-id` propagation → interview `startInterview` validates role/type → `graph.invoke({action:"start", ...})` → START router → `interviewAgent` node → ChatGroq → parsed questions → interview document saved → first question returned.

Each `POST /api/interview/answer` loads interview by ID and user ID, updates current question answer, computes completion, and invokes a fresh graph with `action:"feedback"`. The graph runs feedback and optionally summary, then controller persists the feedback/progress/report and returns response. No graph thread ID ties invocations together.

## Roadmap invocation

`POST /api/roadmap/generate` → gateway session validation → handler validates role/package and optional resume → `graph.invoke(...)` → fixed roadmapAgent then resourceAgent → controller persists roadmap and updates Redis caches → response.

## Resume invocation

`POST /api/resume/` → gateway session validation → multipart upload → PDF text extraction → direct `resumeAgent` invocation → MongoDB upsert and Redis cache → remove temporary file → response.

## Execution properties

All three user workflows await their operations inline. LLM calls can extend HTTP latency. No streaming, async jobs, graph checkpointing, cancellation interface, or retry queue exists in the inspected code. `maxRetries: 2` is configured on the ChatGroq clients.
