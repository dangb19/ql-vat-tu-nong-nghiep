const express = require("express");

const order = require("../controllers/order.controller");

const router = express.Router();

router.route("/").get(order.findAll).post(order.create);

router.route("/:id").get(order.findOne).put(order.update).delete(order.delete);

module.exports = router;
