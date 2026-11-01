import { Router } from "express";
import {
    generateRoadmap,
    getAllRoadmap,
    getRoadmapById
} from "../controllers/roadmap.controller.js";

const roadmapRouter = Router();

roadmapRouter.post("/generate", generateRoadmap);
roadmapRouter.get("/all", getAllRoadmap);
roadmapRouter.get("/:id", getRoadmapById);

export default roadmapRouter;
