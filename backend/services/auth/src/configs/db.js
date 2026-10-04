import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDb = async()=>{
    try {
        await mongoose.connect(ENV.MONGODB_URL);
        console.log("connected to db");
        
    } catch (error) {
        console.log("error connecting to db");
        
    }
}