const redisClient = require("../config/redis.config");
const { SERVER_ERROR } = require("../constant/error.message");
const { INTERNAL_SERVER_ERROR } = require("../constant/error.code");

const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    if (data) {
      return data;
    } else {
      return null; // Return null if no data found in cache
    }
  } catch (err) {
    console.error("Redis error:", err.message || SERVER_ERROR);
    throw {
      status: INTERNAL_SERVER_ERROR,
      message: err.message || SERVER_ERROR,
    };
  }
};

module.exports = {
  getCache,
};
