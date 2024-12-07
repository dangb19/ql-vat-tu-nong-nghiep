const express = require("express");

const report = require("../controllers/report.controller");

const router = express.Router();

router.route("/total-revenue-profit").get(report.getTotalRevenueProfit);

module.exports = router;
