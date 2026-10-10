import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { llm } from "../config/llm.js";
export const resumeAgent = async (resumeText) => {
    const response = await llm.invoke(
        [
            new SystemMessage(`
               You are an Expert ATS Resume Analyzer.

                Analyze the provided resume and extract:
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
                2. Do not use Markdown or extra text.
                3. Every field must exist.
                4. Follow the exact data types specified below.
                5. **Education, projects, and experience must be arrays of strings, never arrays of objects.**
                6. Each string should contain all relevant information for that entry.

                Return JSON in this exact structure:

                {
                "name": "",
                "email": "",
                "phone": "",
                "summary": "",
                "skills": [],
                "projects": [],
                "education": [],
                "experience": [],
                "strength": [],
                "weakness": [],
                "missingSkills": [],
                "suggestedRole": "",
                "score": 0,
                "recommendations": []
                }

                Example:
                "education": [
                "B.Tech Computer Engineering, VESIT, CGPA: 9.56/10, Aug 2024 - May 2028"
                ],
                "projects": [
                "Auris: AI Voice Platform - Technologies: Next.js, tRPC, Prisma, AWS S3"
                ],
                "experience": [
                "Freelance Full-Stack Developer at Seashore Enterprises (Remote, Apr 2026 - May 2026): Developed a full-stack management application using Next.js and PostgreSQL."
                ]
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

    const analysis = JSON.parse(response.content);
    return {
        ...analysis,
        strength: analysis.strength ?? analysis.strengths ?? [],
        weakness: analysis.weakness ?? analysis.weaknesses ?? []
    };
};