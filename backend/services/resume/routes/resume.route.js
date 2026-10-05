import { Router } from "express";
import { getResume, uploadResume } from "../controllers/resume.controller.js";
import { upload } from "../middleware/multer.js";

const resumeRouter = Router();

resumeRouter.get("/", getResume);
resumeRouter.post("/", upload.single("resume"), uploadResume);

export default resumeRouter;