# 05 — Agentic AI architecture

## Interview graph

The interview service defines an `InterviewState` with action, interview inputs, question/answer data, feedback, completion state, and report. The graph starts by routing `action`:

- `start` runs `interviewAgent`, which chooses the HR or technical prompt and invokes the configured Groq model to produce question JSON.
- `feedback` runs `feedbackAgent`; if `completed` is true, `summaryAgent` then creates a report. Otherwise, the graph ends after feedback.
- The controller invokes the graph inline with `graph.invoke()`, saves interview state to MongoDB, and returns the next question/feedback/report to the caller.

The feedback and summary agents parse model output as JSON. These are model-driven generation steps, not tool-calling agents with arbitrary tool execution.

## Roadmap graph

The roadmap graph is linear: `roadmapAgent` generates a role/package roadmap (optionally using resume fields), then `resourceAgent` requests article recommendations from the LLM and searches YouTube for videos per module. The final roadmap is persisted in MongoDB, with Redis caching for retrieval.

## Resume analysis

The resume service extracts PDF text, passes it to a resume-analysis agent, requests structured JSON, and saves the analysis. It is an agent invocation, not a LangGraph workflow in the inspected code.

## Lifecycle and failure boundaries

These workflows are synchronous in the HTTP request lifecycle; `.invoke()` is awaited and no stream endpoint, queue, worker, checkpoint store, or persistent graph memory is configured. Interview progress is stored in MongoDB by the controller. Redis supports sessions and service caches, not graph checkpoints. Model, parsing, database, or external API failures may fail the request; fallback behavior varies by agent.

See [diagrams/agentic-workflow.mmd](diagrams/agentic-workflow.mmd) and [17-api-documentation.md](17-api-documentation.md). For resilience, consider bounded dependency timeouts, structured error handling, request IDs, model latency/error metrics, and idempotent retry design before adding asynchronous processing.
