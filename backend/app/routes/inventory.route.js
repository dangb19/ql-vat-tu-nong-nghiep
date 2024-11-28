const express = require("express");

const inventory = require("../controllers/inventory.controller");

const router = express.Router();

router.route("/").get(inventory.getInventories).post(inventory.create);

router
  .route("/:id")
  .get(inventory.findOne)
  .put(inventory.update)
  .delete(inventory.delete);

module.exports = router;
