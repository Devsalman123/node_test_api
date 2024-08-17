const axios = require("axios");
const { SERVER_ERROR } = require("../constant/error.message");
const { INTERNAL_SERVER_ERROR } = require("../constant/error.code");
const { getCache } = require("./helpers");
const redisClient = require("../config/redis.config");
const {
  CALENDARIFIC_BASE_URL,
  TTL,
  CALENDAR_API_KEY,
} = require("../config/project.config");

const fetchHolidays = async (country, year) => {
  try {
    const cacheKey = `holidays-${country}-${year}`;

    // Check Redis
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log("Get data");
      return JSON.parse(cachedData);
    }

    // Fetch data
    const response = await axios.get(`${CALENDARIFIC_BASE_URL}/holidays`, {
      params: {
        api_key: CALENDAR_API_KEY,
        country,
        year,
      },
    });

    const holidays = response.data.response.holidays;

    // Store in Redis
    await redisClient.setEx(cacheKey, TTL, JSON.stringify(holidays));

    return holidays;
  } catch (error) {
    console.error("Error fetching holidays:", error.message || SERVER_ERROR);
    throw {
      status: INTERNAL_SERVER_ERROR,
      message: error.message || SERVER_ERROR,
    };
  }
};

const fetchCountries = async () => {
  try {
    const cacheKey = "countries";

    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await axios.get(`${CALENDARIFIC_BASE_URL}/countries`, {
      params: {
        api_key: CALENDAR_API_KEY,
      },
    });
    const countries = response.data.response.countries;
    await redisClient.setEx(cacheKey, TTL, JSON.stringify(countries));
    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error.message || SERVER_ERROR);
    throw {
      status: INTERNAL_SERVER_ERROR,
      message: error.message || SERVER_ERROR,
    };
  }
};

module.exports = {
  fetchHolidays,
  fetchCountries,
};
