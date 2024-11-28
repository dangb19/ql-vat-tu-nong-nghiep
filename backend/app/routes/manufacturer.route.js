const express = require("express");

const manufacturer = require("../controllers/manufacturer.controller");

const router = express.Router();

router.route("/").get(manufacturer.findAll).post(manufacturer.create);

router
  .route("/:id")
  .get(manufacturer.findOne)
  .put(manufacturer.update)
  .delete(manufacturer.delete);

module.exports = router;
