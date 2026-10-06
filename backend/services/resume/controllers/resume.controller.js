import { resumeAgent } from "../agents/resume.agent.js"
import { extractText } from "../config/pdf.js"
import { Resume } from "../models/resume.model.js"
import redisClient from "../../../shared/redis/redis.js"
import fs from "fs"

export const uploadResume = async (req,res)=>{
    try {
        const file = req.file
        if(!file) return res.status(400).json({
            success:false,
            message:"resume pdf is required"
        })
        const userId = req.get("x-user-id")
         if(!userId) return res.status(400).json({
            success:false,
            message:"user id is required"
        })
        const resumeText = await extractText(file.path)
        const aiResponse = await resumeAgent(resumeText)

        let resume = await Resume.findOne({userId})
        if(resume){
            Object.assign(resume,{

                ...aiResponse,
                extractedText: resumeText
            }
        )
        await resume.save()
        }else{
            resume = await Resume.create({
                userId,
                extractedText: resumeText,
                ...aiResponse
            })
        }
        await redisClient.set(`resume:${userId}`,JSON.stringify(resume))
        await fs.unlink(file.path)

        return res.status(200).json({
            success:true,
            message:"resum analyzed successfully",
            data:resume
        })
    } catch (error) {
        if(file){
        await fs.unlinkSync(file.path)
        }
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to analyze resume",
            error: error.message
        });
    }

}



export const getResume = async(req,res)=>{
    try {
        const userId = req.get("x-user-id")
        const cache = await redisClient.get(`resume:${userId}`)
        if(cache){
            return res.status(200).json({
                success:true,
                source:"redis",
                data:JSON.parse(cache)
            })
        }
        const resume = await Resume.findOne({userId})
        if(!resume){
            return res.status(404).json({
                success:false,
                message:"no resume found"
            })
        }
        await redisClient.set(`resume:${userId}`,JSON.stringify(resume))
        return res.status(200).json({
            success:true,
            source:"database",
            data:resume
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to get resume",
            error: error.message
        });
    }
    
}