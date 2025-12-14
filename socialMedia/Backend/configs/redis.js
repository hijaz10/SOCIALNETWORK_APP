import { createClient } from "redis";
import 'dotenv/config';

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});

await redisClient.connect();

export default redisClient;
