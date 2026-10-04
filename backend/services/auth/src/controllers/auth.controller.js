import { getAuth } from "firebase-admin/auth";
import { app } from "../configs/firebase.js";
import { User } from "../models/user.model.js";
import redis from "../../../../shared/redis/redis.js"


export const login = async(req,res)=>{
    try {
        const {token} = req.body;
        const decoded = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({firebaseUid:decoded.uid})
        if(!user){
            user = await User.create({
                name:decoded.name || "",
                email:decoded.email || "",
                firebaseUid:decoded.uid          
            })
        }
        const sessionId = crypto.randomUUID();
        await redis.set(`session:${sessionId}`,JSON.stringify({
            userId:user._id,
            name:user.name,
            email:user.email,
            interviewCoin:user.interviewCoin
        }),"EX",7*24*60*60);
        res.cookie("session",sessionId,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge: 1000*60*60*24*7,
        })
        return res.status(201).json({success:true,user})

    } catch (error) {
        console.log(error)
         return res.status(500).json({success:false,message:"Login failed"})
    }
}


export const logout = async(req,res)=>{
    try {
        const sessionId = req.cookies?.session

        if(sessionId){
            await redis.del(`session:${sessionId}`)
        }
        res.clearCookie("session",{
            httpOnly:true,
            secure:false,
            sameSite:"strict"
        })

        return res.status(200).json({success:true,message:"logout successfully"})
    } catch (error) {
        return res.status(500).json({success:false,message:"logout failed"})
        
    }
}