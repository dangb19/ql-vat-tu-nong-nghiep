const express = require("express");

const orderDetail = require("../controllers/order_detail.controller");

const router = express.Router();

router.route("/").get(orderDetail.findAll).post(orderDetail.create);

router
  .route("/:id")
  .get(orderDetail.findOne)
  .put(orderDetail.update)
  .delete(orderDetail.delete);

module.exports = router;
