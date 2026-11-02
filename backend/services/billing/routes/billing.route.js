import { Router } from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/billing.controller.js";

const billingRouter = Router();

billingRouter.post("/create", createOrder);
billingRouter.post("/verify", verifyPayment);

export default billingRouter;
