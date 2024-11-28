const express = require("express");

const customer = require("../controllers/customer.controller");

const router = express.Router();

router.route("/").get(customer.getCustomers).post(customer.create);

router
  .route("/:id")
  .get(customer.findOne)
  .put(customer.update)
  .delete(customer.delete);

module.exports = router;
