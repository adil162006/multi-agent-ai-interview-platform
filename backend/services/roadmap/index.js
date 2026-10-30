import express from "express";
import { connectDb } from "./config/db.js";
import { ENV } from "./config/env.js";


const app = express()

app.use(express.json())



const PORT=ENV.PORT

app.get("/",(req,res)=>{
    res.json("hello from interview service")
})

app.listen(PORT,()=>{
    console.log(`Interview service server running on ${PORT}`)
    connectDb()
})