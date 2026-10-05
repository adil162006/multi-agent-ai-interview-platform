import Redis from "ioredis"

const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

redisClient.on("ready", () => {
    console.log("Redis ready")
})

redisClient.on("error", (error) => {
    console.error("Redis connection error", error)
})

export default redisClient