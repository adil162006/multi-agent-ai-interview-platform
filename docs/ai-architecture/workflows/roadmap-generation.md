# Roadmap generation workflow

1. Frontend calls `POST /api/roadmap/generate` with `role`, `targetPackage`, and optionally `useResume` plus resume data.
2. Gateway authenticates and forwards `x-user-id`.
3. Controller validates role/package and requires resume data when `useResume` is true.
4. Controller invokes the roadmap StateGraph with request fields.
5. Fixed graph edge runs `roadmapAgent`: builds career prompt, calls ChatGroq, parses roadmap JSON, normalizes level/difficulty.
6. Next fixed edge runs `resourceAgent`: asks the LLM for article strings, then performs per-module YouTube lookups using the YouTube Data API helper.
7. Controller persists `result.roadmap` in MongoDB, deletes cached roadmap-list key, caches individual roadmap for one hour, and returns the roadmap. The resource node mutates the roadmap object but returns `{ state, ...roadmap }` instead of an explicit `{ roadmap }` update; verify actual graph merge/output behavior because resource enrichment may not be reflected reliably in `result.roadmap`.

Errors caught by the controller return HTTP 500. The resource agent itself may return a state with an `error` field on outer failure rather than throwing, so this may not become an HTTP error. See [roadmap agents](../agents/README.md), [roadmap agent diagram](../diagrams/agent-roadmap-generation.mmd), and [roadmap workflow sequence diagram](../diagrams/workflow-roadmap-generation.mmd).
