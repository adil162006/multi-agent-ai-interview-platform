import { ChatGroq } from "@langchain/groq"

export const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    maxTokens: 2500,
    maxRetries: 2,
}) 

