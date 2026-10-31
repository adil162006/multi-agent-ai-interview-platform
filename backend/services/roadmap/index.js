import express from "express";
import { connectDb } from "./configs/db.js";
import { ENV } from "./configs/env.js";
import roadmapRouter from "./routes/roadmap.route.js";


const app = express()

app.use(express.json())
app.use("/", roadmapRouter)



const PORT=ENV.PORT

app.get("/",(req,res)=>{
    res.json("hello from roadmap service")
})

app.listen(PORT,()=>{
    console.log(`roadmap service server running on ${PORT}`)
    connectDb()
})