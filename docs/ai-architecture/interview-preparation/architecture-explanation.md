# Understanding and Explaining the AI Agent Architecture in Technical Interviews

## Concise architecture explanation

“InterviewAI has three AI workflows. Resume analysis extracts text from an uploaded PDF and calls a structured-output ChatGroq-backed agent directly. Interview practice uses a LangGraph state graph with question, feedback, and summary nodes; routing depends on the action and whether the last answer has completed the interview. Roadmap generation uses a linear two-node graph: generate a role roadmap, then enrich modules with article suggestions and YouTube results. Graph state is transient per invocation; MongoDB persists application records and Redis handles sessions and selected caches. Calls are synchronous HTTP request/response; there is no graph checkpointing, streaming, or background queue.”

## Why agents and LangGraph here

The agent functions isolate prompt construction, model invocation, and output parsing by task. LangGraph is used where a workflow has multiple steps and a conditional branch: interview feedback may lead to summary only at completion; roadmap generation always precedes resource enrichment. This is a practical orchestration boundary, not evidence of autonomous planning or agent-to-agent dialogue.

## Coordination, state, tools, memory

Agents coordinate through graph execution and state passed between nodes. Interview agents do not directly call each other; the graph schedules nodes. Roadmap generation passes the roadmap in state to resource enrichment. The resource agent directly calls a YouTube helper. Resume analysis is a direct controller-to-agent call.

Graph state is not persisted across calls. Interview history is saved by the controller in MongoDB; resume and roadmap results are also stored in MongoDB. Redis holds sessions and caches. No message-history memory or graph checkpoint store is configured.

## Failures and limitations

The model clients set `maxRetries: 2`, but there is no application queue or unified retry policy. Most agents parse expected JSON but do not validate schemas. Feedback and summary catches reference `response` outside its try scope, potentially masking the original failure. Resource enrichment catches malformed article JSON and YouTube errors as partial output; its outer catch returns state with an error field. All workflows execute synchronously, so provider latency affects request duration.

Other implementation considerations: interview start only returns the first generated question; supplied type is not strictly validated by the question agent beyond empty-string check (all non-`hr` types choose technical prompt); roadmap agent reads misspelled `suggesstedRole`; frontend errors often return `null`. These details matter when discussing correctness and observability.

## Performance, scale, and security

Scale the interview, roadmap, and resume ECS services independently based on concurrency/provider latency if deployed that way. Bound provider calls, limit prompt size, track latency and parse failures, and design retries to avoid duplicate writes or provider retry storms. Protect the authenticated API path and keep backend services private; `x-user-id` should be trusted only inside a boundary where untrusted callers cannot set it. Resume text and interview answers are personal data sent to an external model provider; address consent, retention, access controls, and provider data policy.

## Reasonable future improvements (not implemented)

- Runtime schema validation of structured model output.
- Structured logs, request correlation, provider latency/error metrics.
- Explicit dependency timeouts and deliberate fallback behavior.
- Graph checkpointer/thread IDs only if durable resumable graph state is required.
- Streaming or background jobs only if product latency requirements warrant their added complexity.
- Tests for graph routing, malformed LLM output, and partial external-resource failures.

See the [technical question set](technical-interview-questions.md).
