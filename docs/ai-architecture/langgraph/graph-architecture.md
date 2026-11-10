# Graph architecture

## Interview graph

Source: `backend/services/interview/graph/graph.js`. State: `InterviewState` in `state.js`.

Registered nodes and topology:

| Node | Function | Reads | Writes | Next |
|---|---|---|---|---|
| `interviewAgent` | `interviewNode` in `nodes.js` | role, type, useResume, resume | questions | END |
| `feedbackAgent` | `feedbackNode` | question, answer, difficulty | feedback | `summaryAgent` if completed, else END |
| `summaryAgent` | `summaryNode` | role, type, questions | report | END |

START has a conditional edge: action `start` selects `interviewAgent`, `feedback` selects `feedbackAgent`, otherwise router returns END. `feedbackRouter` checks `completed`. There are no loops or subgraphs. `interviewNode` passes selected values to `interviewAgent`; feedback and summary nodes similarly invoke their agent function and return partial state updates.

## Roadmap graph

Source: `backend/services/roadmap/graph/roadmap.graph.js`. State: `roadmapState`.

| Node | Function | Reads | Writes | Next |
|---|---|---|---|---|
| `roadmapAgent` | `roadmapAgent` | role, targetPackage, useResume, resume | merged state with roadmap | `resourceAgent` |
| `resourceAgent` | `resourceAgent` | roadmap modules/titles | enriched roadmap (return includes state and spread roadmap fields) | END |

Edges are fixed: START → roadmapAgent → resourceAgent → END. There is no conditional routing or loop. The resource agent's returned object shape is not the same as the declared `roadmapState` key shape: it returns `{ state, ...roadmap }`; it mutates the nested roadmap object before returning. Verify graph state merge/runtime behavior and persisted enrichment against the installed LangGraph version.

## Invocation and persistence

The controllers call `graph.invoke(input)` without a thread ID/config/checkpointer. Each invocation is independent from LangGraph's perspective. Interview controller separately loads/saves interview document; roadmap controller saves the returned roadmap. See [state management](state-management.md).
