import api from "../utils/axios";


export const getCurrentUser = async()=>{
    try {
        const response = await api.get("/api/me");
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const useCoins = async(data)=>{
    try {
        const response = await api.post("/api/auth/use-coins",data)
        return response.data
    } catch (error) {
        return error.response?.data ?? null
    }
}