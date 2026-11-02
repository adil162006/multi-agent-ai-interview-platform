import api from "../utils/axios";


export const getCurrentUser = async()=>{
    const response = await api.get("/api/me");
    return response.data
}

export const useCoins = async(data)=>{
    try {
        const response = await api.post("/api/auth/use-coins",data)
        return response.data
    } catch (error) {
        return error.response?.data ?? null
    }
}