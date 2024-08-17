const redis = require("redis");

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err.message || "Redis connection error");
});

redisClient.connect().catch((err) => {
  console.error(
    "Failed to connect to Redis:",
    err.message || "Connection error"
  );
});

module.exports = redisClient;
