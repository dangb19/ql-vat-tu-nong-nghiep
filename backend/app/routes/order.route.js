const express = require("express");

const order = require("../controllers/order.controller");

const router = express.Router();

router.route("/").get(order.getOrders).post(order.create);

router.route("/orders").get(order.getOrders2);
router.route("/top-selling").get(order.getTopSellingProducts);
router.route("/top-customers").get(order.getTopCustomers);
router.route(`/customer-orders/:customerId`).get(order.getOrdersByCustomer);

router.route("/:id").get(order.findOne).put(order.update).delete(order.delete);

module.exports = router;
