import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import resumeRouter from "./routes/resume.route.js";

dotenv.config();
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/", resumeRouter)

const PORT=process.env.PORT

app.get("/",(req,res)=>{
    res.json("hello from resume service")
})

app.listen(PORT,()=>{
    console.log(`resume service server running on ${PORT}`)
    connectDb()
})