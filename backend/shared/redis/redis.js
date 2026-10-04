import Redis from "ioredis"

const redisClient = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379",
    {
        maxRetriesPerRequest:null
    }
)

redisClient.on("connect",()=>{
    console.log("redis connected");
    
})
redisClient.on("error",(error)=>{
    console.log("redis error",error);
    
})

export default redisClient