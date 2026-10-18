import { Router } from "express";
import { startInterview, submitAnswer,getinterview } from "../controllers/interview.controller.js";

const interviewRouter = Router();

interviewRouter.post("/start", startInterview);
interviewRouter.post("/answer", submitAnswer);
interviewRouter.get("/:id", getinterview);

export default interviewRouter;
