import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors"
import proxy from "express-http-proxy";
import { isAuth } from "./middleware/isAuth.js";
import { getCurrentUser } from "./controller/user.controller.js";
dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin:true,
    credentials:true
}))


const PORT = process.env.PORT


app.use("/api/auth",proxy((process.env.AUTH_SERVICE_URL)))
app.get("/api/me",isAuth,getCurrentUser)
app.listen(PORT,()=>{
    console.log(`gateway server running on ${PORT}`)
})