import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv";

dotenv.config();


export const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    maxTokens: 2500,
    maxRetries: 2,
}) 

