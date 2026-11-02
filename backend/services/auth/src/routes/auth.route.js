import { Router } from "express";
import { addCoins, login, logout, useCoins } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/use-coins", useCoins);
authRouter.post("/add-coins", addCoins);

export default authRouter;