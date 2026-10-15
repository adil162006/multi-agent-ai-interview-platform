import { Annotation } from "@langchain/langgraph";

export const InterviewState = Annotation.Root({
    action:Annotation(),
    type:Annotation(),
    role:Annotation(),
    useResume:Annotation(),
    resume:Annotation(),
    questions: Annotation(),
    question: Annotation(),
    answer: Annotation(),
    difficulty:Annotation(),
    feedback:Annotation(),
    report:Annotation(),
    completed:Annotation()

})

