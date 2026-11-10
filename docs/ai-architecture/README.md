# AI architecture documentation

This section traces the implemented AI workflows from API handler to model/tool calls and persistence. It is based on the checked-in application code; it does not claim that planned features or unverified deployment settings exist.

## At a glance

- **Six implemented agent functions:** interview-question, answer-feedback, interview-summary, roadmap-generation, learning-resource, and resume-analysis.
- **Two compiled LangGraph graphs:** interview workflow and roadmap workflow.
- **Three major AI user workflows:** resume analysis; interview start/answer/report; roadmap generation/resources.
- Interview and roadmap graphs execute synchronously with `graph.invoke()`. Resume analysis invokes its agent directly.
- The LLM clients use LangChain `ChatGroq` configured for `openai/gpt-oss-120b`. The roadmap resource agent also calls YouTube Data API through an Axios helper.
- No graph checkpointing, persistent conversation memory, streaming endpoint, human approval interrupt, or agent-to-agent direct messaging is configured.

## Documentation map

- [system-overview.md](system-overview.md) — architecture and implementation inventory.
- [agents/](agents/README.md) — one page and one detailed flow diagram per agent.
- [langgraph/](langgraph/README.md) — topology, state, routing, lifecycle.
- [workflows/](workflows/) — [resume analysis](workflows/resume-analysis.md), [interview](workflows/interview.md), and [roadmap generation](workflows/roadmap-generation.md), each with a separate sequence diagram.
- [diagrams/](diagrams/) — system, graph, agent communication, request, state, error, and deployment diagrams.
- [interview-preparation/](interview-preparation/architecture-explanation.md) — interview explanation and [32 implementation-specific questions](interview-preparation/technical-interview-questions.md).

## Terminology and scope

“Agent” means an implemented function that builds a prompt, invokes a model and processes the response. The interview and roadmap agents are called by graph nodes; the resume agent is called directly by its controller. Interview feedback/summary do not call tools. Roadmap resource enrichment invokes both an LLM and YouTube search. This implementation does not include autonomous tool selection or direct agent-to-agent messages.

Application source references are relative to the repository root, for example `backend/services/interview/graph/graph.js`.
