const express = require("express");

const supplier = require("../controllers/supplier.controller");

const router = express.Router();

router.route("/").get(supplier.findAll).post(supplier.create);

router
  .route("/:id")
  .get(supplier.findOne)
  .put(supplier.update)
  .delete(supplier.delete);

module.exports = router;
