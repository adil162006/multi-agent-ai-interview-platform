import { Router } from "express";
import { startInterview, submitAnswer } from "../controllers/interview.controller.js";

const interviewRouter = Router();

interviewRouter.post("/start", startInterview);
interviewRouter.post("/answer", submitAnswer);

export default interviewRouter;