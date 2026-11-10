# State management

## Interview state

`backend/services/interview/graph/state.js` defines fields using `Annotation.Root`: `action`, `type`, `role`, `useResume`, `resume`, `questions`, `question`, `answer`, `difficulty`, `feedback`, `report`, `completed`. No custom reducers are defined.

Lifecycle:

1. `startInterview` initializes the graph with action `start`, role/type, and optional resume context.
2. `interviewNode` reads role/type/resume inputs and returns `{ questions }`.
3. On each answer HTTP request, controller loads the interview from MongoDB, adds answer to the in-memory question and initializes a fresh graph input with action `feedback`, current question/answer/difficulty, completion flag, role/type, and full question list. At this point the new feedback for this answer has not been generated/attached.
4. Feedback node returns `{ feedback }`; on final answer summary node returns `{ report }`. Since the report node consumes the pre-feedback `questions` array, it does not receive the current answer's newly generated feedback.
5. Controller writes feedback/progress and final report to MongoDB.

The graph does not persist state across requests. MongoDB interview record is application-level conversation/progress persistence. There is no LangChain message history or transcript memory object. Redis only caches interview listing data and invalidates on completion; it is not graph state.

## Roadmap state

`roadmapState` declares `role`, `targetPackage`, `useResume`, `resume`, and `roadmap` with `Annotation`. No custom reducer or checkpointer is provided. Controller initializes these fields from the request; generation agent returns merged state with roadmap, resource agent enriches it, and controller saves the result in MongoDB and caches retrieval keys in Redis.

## Resume flow

Resume analysis has no graph state. The HTTP handler passes extracted PDF text directly to `resumeAgent`; the returned object and source text are persisted in MongoDB. Redis caches the resume document.

## Distinctions

| Mechanism | Actual purpose |
|---|---|
| Graph state | Transient values passed between nodes within one invoke |
| Conversation/history | Interview question/answer data stored in MongoDB; no LLM chat history object |
| MongoDB | Durable user-facing resume/interview/roadmap records |
| Redis | Session state and selected caches, not graph checkpoint storage |
| Checkpointing | Not configured |
