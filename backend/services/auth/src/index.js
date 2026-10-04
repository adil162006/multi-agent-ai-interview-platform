import express from "express";
import cookieParser from "cookie-parser";
import { connectDb } from "./configs/db.js";

import { ENV } from "./configs/env.js";

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.json("hello from Auth service")
})

app.listen(ENV.PORT,()=>{
    console.log(`auth service server running on ${ENV.PORT}`)
    connectDb()
})