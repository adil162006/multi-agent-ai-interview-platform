# Resume analysis workflow

## Trace

1. Frontend sends `POST /api/resume/` with multipart field `resume`; Axios sends credentials.
2. Gateway `isAuth` validates the cookie-backed Redis session and proxy helper forwards `x-user-id`.
3. Resume router uses `upload.single("resume")`; controller rejects missing file or user ID.
4. `extractText(file.path)` reads PDF and invokes `PDFParse.getText()`.
5. `resumeAgent(resumeText)` builds system/human messages and calls ChatGroq in JSON-object mode.
6. Agent parses response and normalizes strength/weakness aliases.
7. Controller updates or creates a MongoDB Resume for the user, caches it in Redis, removes temporary file, and returns analysis JSON.

On failures, controller attempts to remove the temporary file and returns HTTP 500. No LangGraph or conversational memory participates. See [resume agent](../agents/resume-analysis-agent.md) and [its diagram](../diagrams/agent-resume-analysis.mmd).

## Data flow

Sensitive resume text is supplied to the model provider and stored as `extractedText` in MongoDB. Apply privacy, retention, access-control, and provider data-handling requirements appropriate to the deployment.

See [resume workflow sequence diagram](../diagrams/workflow-resume-analysis.mmd).
