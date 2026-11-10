# Implemented agents

There are six implemented model-backed agent functions. This count excludes conventional Express controllers, graph routers/nodes, PDF extraction, database logic, and the YouTube HTTP helper.

| Agent | Source | Used by | Model | Tool/API |
|---|---|---|---|---|
| Interview question agent | `backend/services/interview/agents/interview.agent.js` | Interview graph node `interviewAgent` | ChatGroq | None |
| Answer feedback agent | `backend/services/interview/agents/feedback.agent.js` | Interview graph node `feedbackAgent` | ChatGroq | None |
| Interview summary agent | `backend/services/interview/agents/summary.agent.js` | Interview graph node `summaryAgent` | ChatGroq | None |
| Roadmap generation agent | `backend/services/roadmap/agents/roadmap.agent.js` | Roadmap graph node `roadmapAgent` | ChatGroq | None |
| Learning resource agent | `backend/services/roadmap/agents/resource.agent.js` | Roadmap graph node `resourceAgent` | ChatGroq | `searchVideo` helper calls YouTube Data API |
| Resume analysis agent | `backend/services/resume/agents/resume.agent.js` | Resume upload controller | ChatGroq | None |

The three interview functions are separate model calls in graph nodes; they do not call one another. Roadmap generation and resource agents share the roadmap state through the graph. Resume analysis has no graph state.

## Individual documentation

- [Interview question agent](interview-question-agent.md) — [diagram](../diagrams/agent-interview-question.mmd)
- [Answer feedback agent](answer-feedback-agent.md) — [diagram](../diagrams/agent-answer-feedback.mmd)
- [Interview summary agent](interview-summary-agent.md) — [diagram](../diagrams/agent-interview-summary.mmd)
- [Roadmap generation agent](roadmap-generation-agent.md) — [diagram](../diagrams/agent-roadmap-generation.mmd)
- [Learning resource agent](learning-resource-agent.md) — [diagram](../diagrams/agent-learning-resource.mmd)
- [Resume analysis agent](resume-analysis-agent.md) — [diagram](../diagrams/agent-resume-analysis.mmd)

No evidence was found for unused/planned agent implementations beyond these source functions. An LLM prompt mentioning an “agent” does not establish a separate autonomous agent runtime.
