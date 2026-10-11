import { Router } from "express";
import { login, logout, useCoins } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/use-coins", useCoins);

export default authRouter;