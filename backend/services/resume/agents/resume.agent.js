import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { llm } from "../config/llm";

export const resumeAgent = async (resumeText) => {
    const response = await llm.invoke(
        [
            new SystemMessage(`
                You are an Expert ATS Resume Analyzer.

                Analyze the given resume and extract:

                - Full Name
                - Email
                - Phone Number
                - Professional Summary
                - Technical Skills
                - Projects
                - Education
                - Experience
                - Strengths
                - Weaknesses
                - Missing Skills
                - Suggested Job Role
                - ATS Score (0-100)
                - Recommendations

                IMPORTANT RULES:

                1. Return ONLY valid JSON.
                2. Do not use markdown.
                3. Do not explain anything.
                4. Do not add extra text.
                5. Every field must exist.


                Return the response as JSON using this structure:

                {
                    "name":"",
                    "email":"",
                    "phone":"",
                    "summary":"",
                    "skills":[],
                    "projects":[],
                    "education":[],
                    "experience":[],
                    "strengths":[],
                    "weaknesses":[],
                    "missingSkills":[],
                    "suggestedRole":"",
                    "score":0,
                    "recommendations":[]
                }

            `),

            new HumanMessage(`
                Analyze this resume:

                ${resumeText}
            `)
        ],
        {
            response_format: {
                type: "json_object"
            }
        }
    );

    return JSON.parse(response.content);
};