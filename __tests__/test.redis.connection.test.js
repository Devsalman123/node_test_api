const redisClient = require("../config/redis.config");
const testRedisConnection = require("../utils/test.redis.connection");

// Mock Redis methods
jest.mock("../config/redis.config", () => ({
  ping: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
}));

describe("testRedisConnection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.only("should successfully ping Redis", async () => {
    redisClient.ping.mockResolvedValue("PONG");
    await testRedisConnection();

    expect(redisClient.ping).toHaveBeenCalled();
  });

  test.only("should handle Redis ping failure", async () => {
    redisClient.ping.mockRejectedValue(new Error("Ping failed"));

    await testRedisConnection();

    expect(redisClient.ping).toHaveBeenCalled();
  });
});
