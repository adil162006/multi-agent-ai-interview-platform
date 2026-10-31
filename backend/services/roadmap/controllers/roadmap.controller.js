import { graph } from "../graph/roadmap.graph";
import { Roadmap } from "../models/roadmap.model";
import redisClient from "../../../shared/redis/redis.js"


export const generateRoadmap = async(req,res)=>{
    try {
        const {
            role,
            targetPackage,
            useResume=false,
            resume
        }=req.body
        const userId = req.headers["x-user-id"];

        if(!role || !targetPackage){
            return res.status(400).json({
                success: false,
                message:"Role and Target Package are required"
            })
        }

        if(useResume&&!resume){
             return res.status(400).json({
                success: false,
                message:"Resume data is required"
            })
        }

        const result = await graph.invoke({
            role,
            targetPackage,
            useResume,
            resume
        })

        const roadmap = await Roadmap.create({
            userId,
            ...result.roadmap
        })
        await redisClient.del(`userRoadmaps:${userId}`)
        await redisClient.set(
            `roadmap:${userId}:${roadmap._id}`,
            JSON.stringify(roadmap),"EX",60*60
        )
        return res.status(201).json({
            success:true,
            message:"Roadmap created succesfully",
            data:roadmap
        })
    } catch (error) {
        console.error("Generate Roadmap Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate roadmap"
        });
    }
}


export const getAllRoadmap= async (req,res)=>{
    try {
        const userId = req.headers["x-user-id"];
        const cache = await redisClient.get(`userRoadmaps:${userId}`);
        if(cache){
            return res.status(200).json({
                success:true,
                data:JSON.parse(cache)
            })
        }

        const roadmaps = await Roadmap.find({userId}).sort({
            createdAt:-1
        })
        await redisClient.set(
            `userRoadmaps:${userId}`,
            JSON.stringify(roadmaps),"EX",60*60
        )

        return res.status(200).json({
            success:true,
            data:roadmaps
        })

    } catch (error) {
        console.error("Get Roadmaps Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get roadmaps"
        });
    }
}


export const getRoadmapById = async(req,res)=>{
    try {
        const {id} = req.params;
        const userId = req.headers["x-user-id"];

        const cache = await redisClient.get(`roadmap:${userId}:${id}`);
        if(cache){
            return res.status(200).json({
                success:true,
                data:JSON.parse(cache)
            })
        }
        const roadmap = await Roadmap.findOne({
            _id:id,
            userId:userId
        })

        if(!roadmap){
            return res.status(404).json({
                success:false,
                message:"Roadmap not found"
            })
        }

        await redisClient.set(
            `roadmap:${userId}:${id}`,
            JSON.stringify(roadmap),"EX",60*60
        )

        return res.status(200).json({
            success:true,
            data:roadmap
        })

    } catch (error) {
        console.error("Get Roadmap Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get roadmap"
        });
    }
}