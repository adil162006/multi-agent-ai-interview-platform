# Conditional routing

## Interview entry router

Implemented in `backend/services/interview/graph/graph.js`:

```js
function router(state) {
  switch (state.action) {
    case "start": return "interviewAgent";
    case "feedback": return "feedbackAgent";
    default: return END;
  }
}
```

It reads only `state.action`. `addConditionalEdges(START, router, ...)` maps `start` and `feedback` to registered nodes. The mapping shown in source does not explicitly include `END` even though the router can return it for other actions; unknown-action behavior should be verified against the installed LangGraph version. API controllers currently send only the two expected actions.

## Interview completion router

`feedbackRouter(state)` returns `summaryAgent` when `state.completed` is truthy; otherwise it returns `END`. This controls whether final report generation occurs after feedback. The controller calculates completion from the current question index and total question count.

## Roadmap routing

There are no conditional routers. Edges are static and sequential.

## No hidden routing

Prompt content can influence generated text but does not choose graph nodes. No model-based router, tool-calling branch, loop, interrupt, or human-in-the-loop path is implemented.
