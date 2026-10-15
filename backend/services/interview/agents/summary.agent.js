import { llm } from "../config/llm.js"
import { summaryPrompt } from "../prompts/summaryPrompt.js"



export const summaryAgent = async(data)=>{
    try {
        const prompt = summaryPrompt(data)
    const response = await llm.invoke(prompt)

    const clean = response.content.replace(/```json/g,"").replace(/```/g,"").trim()

    return JSON.parse(clean)
    } catch (error) {
        console.log(response.content);
        throw new Error("failed to generate Summary");
        
    }


}