import api from "../utils/axios"



export const getResume= async()=>{
    try {
        const response = await api.get("/api/resume/")
        console.log(response.date);
        return response.data
        

    } catch (error) {
        console.log(error)
        return null
    }
}