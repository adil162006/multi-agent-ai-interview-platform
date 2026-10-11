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

export const useCoins = async(req,res)=>{
    try {
        const sessionId = req.cookies?.session
        const session =  await redis.get(`session:${sessionId}`);
        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Session Expired"
            });
        }
        const sessionData = JSON.parse(session)
        const {coins,action} = req.body
        if(!coins){
            return res.status(400).json({success:false,message:"coins is required"})

        }
        const user = await User.findById(sessionData?.userId)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        if(user.interviewCoin < coins){
            return res.status(403).json({
                success:false,
                message:"Not enough interview coins"
            })
        }
        user.interviewCoin -=coins
        await user.save()
        await redis.set(`session:${sessionId}`,JSON.stringify({
            userId:user._id,
            name:user.name,
            email:user.email,
            interviewCoin:user.interviewCoin
        }),"EX",7*24*60*60);


        return res.status(200).json({
            success:true,
            message:"Interview coins updated successfully",
            action,
            interviewCoin:user.interviewCoin
        })

    } catch (error) {
         return res.status(500).json({success:false,message:error.message})
        
    }
}