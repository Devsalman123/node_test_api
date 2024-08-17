const redisClient = require("../config/redis.config");

async function testRedisConnection() {
  try {
    // Ping Redis server to check connection
    const pingResponse = await redisClient.ping();
    console.log("Redis ping response:", pingResponse);

    if (pingResponse === "PONG") {
      console.log("Redis connection successful.");

      // Perform basic Redis operations as a test
      await redisClient.set("test_key", "test_value");
      console.log("Redis connection successful, test key set.");

      const value = await redisClient.get("test_key");
      console.log("Value from Redis:", value);

      // Delete the test key
      await redisClient.del("test_key");
      console.log("Test key deleted from Redis.");
    } else {
      console.error(
        "Redis connection failed, unexpected response:",
        pingResponse
      );
    }
  } catch (err) {
    console.log("Redis connection failed:", err.message);
  }
}

module.exports = testRedisConnection;
