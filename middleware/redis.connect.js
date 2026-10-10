import { createClient } from "redis";
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
})

const redisConnect = () => {
    redisClient.on("error", (err) => console.error('Redis error:', err));
    (async () => {
        await redisClient.connect()
        console.log("Redis Connected")
    })();
}

export default redisConnect