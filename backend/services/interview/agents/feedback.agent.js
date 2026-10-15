import { llm } from "../config/llm.js"
import { feedbackPrompt } from "../prompts/feeedbackPrompt.js"



export const feedbackAgent = async(data)=>{
    try {
        const prompt = feedbackPrompt(data)

    const response = await llm.invoke(prompt)

    const clean = response.content.replace(/```json/g,"").replace(/```/g,"").trim()

    return JSON.parse(clean)
    } catch (error) {
        console.log(response.content);
        throw new Error("failed to generate feedback quesions");
        
    }


}