const axios = require("axios");
const redisClient = require("../config/redis.config");
const { INTERNAL_SERVER_ERROR } = require("../constant/error.code");
const {
  fetchHolidays,
  fetchCountries,
} = require("../services/holiday.service");

jest.mock("axios");
jest.mock("../config/redis.config", () => ({
  get: jest.fn(),
  setEx: jest.fn(),
}));

describe("All Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchHolidays", () => {
    it("should fetch holidays from API", async () => {
      const apiResponse = {
        data: {
          response: {
            holidays: [{ name: "New Year" }],
          },
        },
      };
      redisClient.get.mockResolvedValue(null);
      axios.get.mockResolvedValue(apiResponse);

      const result = await fetchHolidays("PK", 2024);

      expect(redisClient.get).toHaveBeenCalledWith("holidays-PK-2024");
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/holidays"),
        {
          params: {
            api_key: process.env.CALENDAR_API_KEY,
            country: "PK",
            year: 2024,
          },
        }
      );
      expect(redisClient.setEx).toHaveBeenCalledWith(
        "holidays-PK-2024",
        3600,
        JSON.stringify(apiResponse.data.response.holidays)
      );
      expect(result).toEqual(apiResponse.data.response.holidays);
    });

    it("should handle API errors", async () => {
      redisClient.get.mockResolvedValue(null); // No cache
      axios.get.mockRejectedValue(new Error("API Error"));

      await expect(fetchHolidays("PK", 2024)).rejects.toEqual({
        status: INTERNAL_SERVER_ERROR,
        message: "API Error",
      });

      expect(redisClient.get).toHaveBeenCalledWith("holidays-PK-2024");
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/holidays"),
        {
          params: {
            api_key: process.env.CALENDAR_API_KEY,
            country: "PK",
            year: 2024,
          },
        }
      );
    });
  });

  describe("fetchCountries", () => {
    it("should fetch countries from API", async () => {
      const apiResponse = {
        data: {
          response: {
            countries: [{ name: "United States" }],
          },
        },
      };
      redisClient.get.mockResolvedValue(null);
      axios.get.mockResolvedValue(apiResponse);

      const result = await fetchCountries();

      expect(redisClient.get).toHaveBeenCalledWith("countries");
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/countries"),
        {
          params: {
            api_key: process.env.CALENDAR_API_KEY,
          },
        }
      );
      expect(redisClient.setEx).toHaveBeenCalledWith(
        "countries",
        3600,
        JSON.stringify(apiResponse.data.response.countries)
      );
      expect(result).toEqual(apiResponse.data.response.countries);
    });

    it("should handle API errors", async () => {
      redisClient.get.mockResolvedValue(null);
      axios.get.mockRejectedValue(new Error("API Error"));

      await expect(fetchCountries()).rejects.toEqual({
        status: INTERNAL_SERVER_ERROR,
        message: "API Error",
      });

      expect(redisClient.get).toHaveBeenCalledWith("countries");
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/countries"),
        {
          params: {
            api_key: process.env.CALENDAR_API_KEY,
          },
        }
      );
    });
  });
});
