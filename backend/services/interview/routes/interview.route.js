import { Router } from "express";
import {
    getAllInterview,
    getinterview,
    startInterview,
    submitAnswer
} from "../controllers/interview.controller.js";

const interviewRouter = Router();

interviewRouter.post("/start", startInterview);
interviewRouter.post("/answer", submitAnswer);
interviewRouter.get("/all", getAllInterview);
interviewRouter.get("/:id", getinterview);

export default interviewRouter;
