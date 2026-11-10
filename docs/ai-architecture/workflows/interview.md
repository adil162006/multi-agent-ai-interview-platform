# Interview workflow

## Start

1. Frontend calls `POST /api/interview/start` with role, type, and optional resume context using credentials.
2. Gateway validates session; forwards `x-user-id`.
3. Interview handler checks role/type, then invokes graph with action `start`.
4. START router selects `interviewAgent`; node invokes question agent.
5. Agent selects HR prompt only for normalized `hr`; otherwise technical prompt; ChatGroq response is parsed.
6. Controller creates MongoDB interview record with questions and returns ID, count, and first question.

## Answer and completion

1. Frontend calls `POST /api/interview/answer` with interviewId and answer.
2. Controller loads the interview constrained by both ID and user ID, rejects missing/completed records, records the answer, and determines whether the final question is reached.
3. It invokes a new graph input with action `feedback`, current question/answer/difficulty, completion flag, role/type, and question array. The current question's answer is present, but its newly generated feedback is not yet attached to the question array.
4. Feedback node runs on every answer. If final, conditional edge runs summary node. Consequently, the summary sees prior feedback and the final answer, but not the final answer's feedback (the controller attaches that after graph execution).
5. Controller saves feedback and increments progress. On final answer, it saves report fields, invalidates the Redis interview-list cache, and returns full interview/report; otherwise returns next question and feedback.

The frontend API functions are in `frontend/src/apis/interview.api.js`; graph execution is synchronous. See [graph architecture](../langgraph/graph-architecture.md), [agent pages](../agents/README.md), and [interview sequence diagram](../diagrams/workflow-interview.mmd).

## Validation note

The answer handler currently checks `if (!interviewId && !answer)`; this rejects only when both values are absent, rather than either one. This is an implementation gap, not intended validation behavior.
