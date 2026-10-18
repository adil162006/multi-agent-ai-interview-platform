import { hrInterviewPrompt } from "../prompts/hrInterviewPrompt.js"
import { technicalInterviewPrompt } from "../prompts/technicalInterviewPrompt.js"
import { llm } from "../config/llm.js"



export const interviewAgent = async(data)=>{
    try {
        const type = typeof data?.type === "string" ? data.type.trim().toLowerCase() : ""
        if (!type) {
            throw new Error("Interview type is required to generate questions")
        }

        const prompt = type === "hr" ? hrInterviewPrompt(data) : technicalInterviewPrompt(data)

    const response = await llm.invoke(prompt)

    const clean = response.content.replace(/```json/g,"").replace(/```/g,"").trim()

    return JSON.parse(clean)
    } catch (error) {
        console.error("Failed to generate interview questions:", error)
        throw error
    }


}
