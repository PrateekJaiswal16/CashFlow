import { createClient } from 'redis';

const redisUrl = process.env.REDIS_HOST+':'+process.env.REDIS_PORT;

if (!redisUrl) {
    console.warn("REDIS_URL not found, caching will be disabled.");
}

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect the client.

(async () => {
    if (redisUrl) {
        await redisClient.connect();
        console.log("Redis client connected.");
    }
})();

export default redisClient;