const express = require("express");
const { holidayController } = require("../controllers");
const router = express.Router();

router.get("/holidays", holidayController.getHolidays);
router.get("/countries", holidayController.getCountries);

module.exports = router;
