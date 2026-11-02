import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  REDIS_URL: process.env.REDIS_URL,
  RAZOR_PAY_API_KEY: process.env.RAZOR_PAY_API_KEY,
  RAZOR_PAY_SECRET_KEY: process.env.RAZOR_PAY_SECRET_KEY,
};
