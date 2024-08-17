const service = require("../services/index");
const { sendSuccess, sendError } = require("../utils/response.handler");
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../constant/error.code");
const {
  COUNTRY_YEAR_REQUIRED,
  HOLIDAYS_FETCH_FAIL,
  COUNTRIES_FETCH_FAIL,
} = require("../constant/error.message");

const getHolidays = async (req, res) => {
  const { country, year } = req.query;

  if (!country || !year) {
    return sendError(res, COUNTRY_YEAR_REQUIRED, BAD_REQUEST);
  }

  try {
    const holidays = await service.holidayServices.fetchHolidays(country, year);
    sendSuccess(res, holidays);
  } catch (error) {
    sendError(res, HOLIDAYS_FETCH_FAIL, INTERNAL_SERVER_ERROR, error.message);
  }
};

const getCountries = async (req, res) => {
  try {
    const countries = await service.holidayServices.fetchCountries();
    sendSuccess(res, countries);
  } catch (error) {
    sendError(res, COUNTRIES_FETCH_FAIL, INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  getHolidays,
  getCountries,
};
