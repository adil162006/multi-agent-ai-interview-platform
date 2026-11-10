# Technical interview questions and answers

## Beginner

### 1. How many AI agents are implemented?
Six model-backed functions: three interview agents, two roadmap agents, and one resume agent. Controllers, graph nodes, PDF parsing, and the YouTube helper are not counted as agents.

### 2. Which LLM integration is used?
Each AI service initializes LangChain `ChatGroq` for `openai/gpt-oss-120b` at temperature 0.2. The exact credential is environment configuration and is not documented here.

### 3. Which workflows use LangGraph?
Interview and roadmap. Resume analysis calls `resumeAgent` directly from its controller.

### 4. What does the interview question agent do?
It normalizes interview type, chooses HR prompt only for `hr` and technical prompt otherwise, invokes the model, strips JSON fences, and parses the response.

### 5. What does the resume agent receive?
Extracted plain text from the uploaded PDF. PDF extraction occurs before the agent invocation.

### 6. Does the system stream generated responses?
No streaming endpoint or streaming graph/model invocation is evident. Controllers await model calls and then send ordinary HTTP responses.

### 7. Where are interview records stored?
MongoDB. Controller code stores questions, answers, feedback, progress and final report fields.

### 8. Is Redis the agent memory?
No. Redis stores sessions and selected caches. It is not used as LangGraph checkpoint storage or conversation message history.

## Intermediate

### 9. What are the interview graph nodes?
`interviewAgent` → `interviewNode`, `feedbackAgent` → `feedbackNode`, and `summaryAgent` → `summaryNode`.

### 10. How does interview graph entry route?
The START conditional router reads `state.action`: `start` routes to question generation; `feedback` routes to feedback; other values return END.

### 11. When does summary generation run?
After feedback when `state.completed` is truthy. Otherwise feedback is terminal for that graph invocation.

### 12. How is interview state persisted between answers?
It is not persisted by LangGraph. Each answer handler loads the MongoDB interview and creates a fresh graph input.

### 13. What is the roadmap graph topology?
A fixed sequence: START → `roadmapAgent` → `resourceAgent` → END, with no conditional edges.

### 14. How does the resource agent get videos?
It calls `searchVideo` for each module. The helper uses YouTube Data API: a FreeCodeCamp-oriented search first, then a fallback tutorial search.

### 15. What is asked of the feedback model?
Score dimensions, short feedback, and exactly three actionable improvements. The result is parsed but not runtime-validated.

### 16. What persists resume analysis?
The controller creates or updates a MongoDB resume record and caches it in Redis; extracted text is also stored in MongoDB.

### 17. Are agents directly communicating?
No. Interview agents are invoked by graph nodes; roadmap nodes share graph state. They do not issue direct messages to each other.

## Advanced

### 18. Is the interview workflow a persistent conversation?
At the product level, interview records persist in MongoDB, but LangGraph has no checkpointer/thread ID. Each HTTP answer request is a separate graph invocation using controller-supplied context.

### 19. What validates model output?
Mostly `JSON.parse` after removing Markdown fences. Resume asks for JSON response mode; none of the agent functions provide comprehensive runtime schema validation.

### 20. What error-handling defect exists in feedback and summary agents?
Their catch blocks reference `response.content` although `response` is block-scoped inside `try`, so a failure can trigger `ReferenceError` and mask the original exception.

### 21. How are model retries configured?
ChatGroq client configuration sets `maxRetries: 2`. This is provider client behavior, not an application retry workflow with idempotency or backoff policy visible in source.

### 22. What is a partial-success path in roadmap resources?
Malformed article JSON becomes an empty article list; YouTube errors return null and produce empty URLs. A broader error returns state plus an `error` property instead of throwing.

### 23. What state does interview `summaryNode` read?
Role, type, and questions. The controller passes the full question list containing prior answers and per-question feedback at completion.

### 24. How does the interview controller decide completion?
It compares current question index plus one with the number of questions. That boolean is passed into graph state for conditional routing.

### 25. What role does the gateway play?
It checks Redis-backed sessions on protected routes, routes URL prefixes to services, and forwards `x-user-id`; it does not orchestrate graph nodes.

### 26. What is a state-shape issue to review in roadmap graph?
`resourceAgent` returns `{ state, ...roadmap }`, while declared graph state has `roadmap` as a field. The shape should be checked against LangGraph merge semantics and adjusted in source only through a separately scoped code change.

### 27. What resume context mismatch exists?
Roadmap agent reads `state.resume.suggesstedRole` (misspelled), while the resume model uses `suggestedRole`; that value will generally be undefined in generated context.

### 28. Why might synchronous LLM calls be a scaling bottleneck?
Requests remain open while provider calls execute, so slow or concurrent model calls consume service capacity and increase tail latency. Measure latency/concurrency and use bounded timeouts before deciding whether asynchronous jobs are needed.

### 29. What privacy consideration applies to resume analysis?
The full extracted resume text is sent in the model prompt and stored in MongoDB. The deployment needs appropriate user consent, retention, access control, and provider data-handling review.

### 30. How would you test conditional routing?
Unit-test router outcomes for start, feedback, unknown action and completion false/true; then test graph invocation with stubbed agent functions to verify which nodes execute and expected partial state outputs.

### 31. Does the roadmap graph have human approval or loops?
No. It is a two-node linear graph without interrupts, human-in-the-loop paths, loops, or subgraphs.

### 32. Why use a graph rather than one long function?
The interview flow has meaningful state and conditional completion behavior, while roadmap has two ordered transformation steps. A graph makes those transitions explicit, although this implementation does not need advanced persistence or autonomous planning features.
