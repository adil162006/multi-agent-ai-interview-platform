# LangGraph documentation

Two graphs are constructed with `StateGraph(...).compile()`:

1. Interview graph: `backend/services/interview/graph/graph.js`, state in `state.js`, graph node functions in `nodes.js`.
2. Roadmap graph: `backend/services/roadmap/graph/roadmap.graph.js`, state in `roadmap.state.js`; agent functions are directly registered nodes.

No checkpointer, thread configuration, interrupt, subgraph, or streaming invocation appears in the inspected graph setup. Graph state exists for a single `invoke()` call. Durable user-visible progress is held in MongoDB by the API controllers.

- [Graph architecture and node table](graph-architecture.md)
- [State management](state-management.md)
- [Conditional routing](conditional-routing.md)
- [Execution lifecycle](execution-lifecycle.md)
- [Complete graph diagram](../diagrams/langgraph-orchestration.mmd)
