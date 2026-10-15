import { hrInterviewPrompt } from "../prompts/hrInterviewPrompt"
import { technicalInterviewPrompt } from "../prompts/technicalInterviewPrompt"
import { llm } from "../config/llm"



export const interviewAgent = async(data)=>{
    try {
        const prompt = data?.type.toLowerCase() === "hr" ? hrInterviewPrompt(data) : technicalInterviewPrompt(data)

    const response = await llm.invoke(prompt)

    const clean = response.content.replace(/```json/g,"").replace(/```/g,"").trim()

    return JSON.parse(clean)
    } catch (error) {
        console.log(response.content);
        console.log("failed to generate interview quesions");
        
    }


}