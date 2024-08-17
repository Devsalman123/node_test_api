require("dotenv").config();
const express = require("express");
const allRoutes = require("./routes/index");
const testRedisConnection = require("./utils/test.redis.connection");

// Test Redis connection
testRedisConnection();

const app = express();

// All routes
app.use("/api", allRoutes.holidayRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
