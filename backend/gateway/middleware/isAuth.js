import redisClient from "../../shared/redis/redis.js";

export const isAuth = async (req, res, next) => {
    try {
        const sessionId = req.cookies?.session;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const session = await redisClient.get(`session:${sessionId}`);

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Session Expired"
            });
        }

        req.user = JSON.parse(session);

        next();
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};