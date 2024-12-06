const express = require("express");

const order = require("../controllers/order.controller");

const router = express.Router();

router.route("/").get(order.getOrders).post(order.create);
// router.route("/order-info").get(order.getOrderInfo);
router.route("/orders").get(order.getOrders2);

router.route("/:id").get(order.findOne).put(order.update).delete(order.delete);

module.exports = router;
