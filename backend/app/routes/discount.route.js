const express = require("express");

const discount = require("../controllers/discount.controller");

const router = express.Router();

router.route("/").get(discount.findAll).post(discount.create);

router
  .route("/:id")
  .get(discount.findOne)
  .put(discount.update)
  .delete(discount.delete);

module.exports = router;
