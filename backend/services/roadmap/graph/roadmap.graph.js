import {  StateGraph, START, END } from "@langchain/langgraph";
import { roadmapState } from "./roadmap.state.js";
import { roadmapAgent } from "../agents/roadmap.agent.js";
import { resourceAgent } from "../agents/resource.agent.js";

export const graph = new StateGraph(roadmapState)
.addNode("roadmapAgent",roadmapAgent)
.addNode("resourceAgent",resourceAgent)
.addEdge(START,"roadmapAgent")
.addEdge("roadmapAgent","resourceAgent")
.addEdge("resourceAgent",END).compile()


