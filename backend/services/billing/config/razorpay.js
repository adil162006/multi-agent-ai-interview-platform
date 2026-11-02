import Razorpay from "razorpay";
import { ENV } from "./env.js";

export const razorpay = new Razorpay({
  key_id: ENV.RAZOR_PAY_API_KEY,
  key_secret: ENV.RAZOR_PAY_SECRET_KEY,
});