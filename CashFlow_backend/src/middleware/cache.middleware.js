import redisClient from '../lib/redisClient.js';

const CACHE_EXPIRATION_SECONDS = 3600; // Cache for 1 hour

export const cacheMiddleware = async (req, res, next) => {
    if (!redisClient.isReady) {
        return next(); // If Redis isn't connected, just skip caching.
    }

    // Create a unique key based on the user ID and the specific URL they are requesting.
    const key = `cache:${req.userId}:${req.originalUrl}`;

    try {
        const cachedData = await redisClient.get(key);

        if (cachedData) {
            // If data is found in the cache, send it back immediately.
            console.log(`CACHE HIT for key: ${key}`);
            return res.json(JSON.parse(cachedData));
        } else {
            // If data is not in the cache, proceed to the actual controller.
            console.log(`CACHE MISS for key: ${key}`);
            
            // We'll modify the response to save the result to the cache before sending it.
            const originalJson = res.json.bind(res);
            res.json = (data) => {
                redisClient.setEx(key, CACHE_EXPIRATION_SECONDS, JSON.stringify(data));
                return originalJson(data);
            };
            next();
        }
    } catch (err) {
        console.error("Redis error:", err);
        next(); // In case of a Redis error, proceed without caching.
    }
};