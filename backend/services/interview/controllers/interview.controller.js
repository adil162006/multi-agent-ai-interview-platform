import graph from "../graph/graph.js"
import { Interview } from "../models/interview.model.js"
import redisClient from "../../../shared/redis/redis.js"



export const startInterview = async(req,res)=>{
    try {
        const userId = req.headers["x-user-id"]
        const {
            type,
            role,
            useResume=false,
            resume={}
        }=req.body

        if(!type || !role){
            return res.status(400).json({
                success:false,
                message:"Interview type and role are required"
            })
        }

        const result  =  await graph.invoke({
            action:"start",
            role,
            type,
            useResume,
            resume
        })

        const questions = result.questions;

        if(!questions || questions.length===0){
            return res.status(400).json({
                success:false,
                message:"Failed to generate interview question"
            })
        }
        const interview = await Interview.create({
            userId,
            type,
            role,
            useResume,
            questions,
            currentQuestion:0,
            status:"in-progress"
        })
        return res.status(200).json({
            success:true,
            interviewId:interview._id,
            currentQuestion:0,
            totalQuestions:interview.questions.length,
            question: interview.questions[0]
        
        })
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

export const submitAnswer = async(req,res)=>{
    try {
        const userId = req.headers["x-user-id"]
        const {
            interviewId,
            answer
        } = req.body

        if(!interviewId&& !answer){
            return res.status(400).json({
                success:false,
                message:"inerviewid and aswer are required"
            })
        }
        const interview = await Interview.findOne({
            _id:interviewId,
            userId
        })

        if(!interview){
            return res.status(404).json({
                success:false,
                message:"interview  not found "
            })
        }
        if(interview.status=== "completed"){
            return res.status(400).json({
                success:false,
                message:"interview already completed"
            })


        }

        const index = interview.currentQuestion
        const currentQuestion = interview.questions[index]

        if(!currentQuestion){
            return res.status(400).json({
                success:false,
                message:"invalid question index"
            })
        }


        currentQuestion.userAnswer = answer;

        const completed = interview.currentQuestion +1 >=interview.questions.length;

        const result = await graph.invoke({
            action:"feedback",
            question : currentQuestion.length,
            answer,
            difficulty: currentQuestion.difficulty,
            completed,
            role:interview.role,
            type: interview.type,
            questions: interview.questions
        
        })

        currentQuestion.feedback = result.feedback
        interview.currentQuestion++;


        if(completed){
            interview.status= "completed";
            interview.overallScore=result.report.overallScore
            interview.summary = result.report.summary
            interview.strengths = result.report.strengths
            interview.weaknesses = result.report.weaknesses
            interview.recommendations = result.report.recommendations
            await interview.save()

            // Invalidate cached interview data
            await redisClient.del(`interview:${userId}`);
         return res.status(200).json({
            success:true,
            completed:true,
            interview,
            feedback : result.feedback

         })

        }

        await interview.save()


         return res.status(200).json({
            success:true,
            completed:false,
            currentQuestion:interview.currentQuestion,
            question:interview.questions[interview.currentQuestion],
            feedback : result.feedback
         })

       
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


export const getinterview = async(req,res)=>{
    try {
        const userId = req.headers["x-user-id"]
        const {id} = req.params
        const interview = await  Interview.findOne({_id:id,userId})
         if(!interview){
            return res.status(404).json({
                success:false,
                message:"interview  not found "
            })
        }
        return res.status(200).json({
            success:true,
            interview
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



export const getAllInterview = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        const cache = await redisClient.get(`interview:${userId}`);

        if (cache) {
            console.log("served from redis");
            return res.status(200).json(JSON.parse(cache));
        }

        const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });

        const completed = interviews.filter(
            (item) => item.status === "completed"
        );

        const totalQuestions = interviews.reduce(
            (sum, item) => sum + item.questions.length, 0
        );

        const averageScore = completed.length > 0
            ? Number(
                (
                    completed.reduce((sum, item) => sum + item.overallScore, 0) /
                    completed.length
                ).toFixed(1)
            )
            : 0;

        const stats = {
            totalInterviews: interviews.length,
            totalQuestions,
            completed: completed.length,
            averageScore
        };

        const getAverageData = (list) => {
            const total = {
                correctness: 0,
                clarity: 0,
                relevance: 0,
                detail: 0,
                efficiency: 0,
                communication: 0,
                problemSolving: 0,
                creativity: 0
            };

            let count = 0;

            list.forEach((interview) => {
                interview.questions.forEach((q) => {
                    const feedback = q.feedback || {};

                    total.correctness += feedback.correctness || 0;
                    total.clarity += feedback.clarity || 0;
                    total.relevance += feedback.relevance || 0;
                    total.detail += feedback.detail || 0;
                    total.efficiency += feedback.efficiency || 0;
                    total.communication += feedback.communication || 0;
                    total.problemSolving += feedback.problemSolving || 0;
                    total.creativity += feedback.creativity || 0;

                    count++;
                });
            });

            return [
                { skill: "Correctness", score: count ? Math.round(total.correctness / count) : 0 },
                { skill: "Clarity", score: count ? Math.round(total.clarity / count) : 0 },
                { skill: "Relevance", score: count ? Math.round(total.relevance / count) : 0 },
                { skill: "Detail", score: count ? Math.round(total.detail / count) : 0 },
                { skill: "Efficiency", score: count ? Math.round(total.efficiency / count) : 0 },
                { skill: "Communication", score: count ? Math.round(total.communication / count) : 0 },
                { skill: "Problem Solving", score: count ? Math.round(total.problemSolving / count) : 0 },
                { skill: "Creativity", score: count ? Math.round(total.creativity / count) : 0 }
            ];
        };

        const technicalInterview = completed.filter(
            (item) => item.type === "technical"
        );

        const hrInterview = completed.filter(
            (item) => item.type === "hr"
        );

        const technicalData = getAverageData(technicalInterview);
        const hrData = getAverageData(hrInterview);

        const technicalCount = technicalInterview.length;
        const hrCount = hrInterview.length;

        const payload = {
            success: true,
            interviews,
            stats,
            technicalData,
            hrData,
            technicalCount,
            hrCount
        };

        await redisClient.set(
            `interview:${userId}`,
            JSON.stringify(payload),
            "EX",
            600
        );

        return res.status(200).json(payload);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
