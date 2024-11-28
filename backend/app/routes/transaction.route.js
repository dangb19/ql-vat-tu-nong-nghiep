const express = require("express");

const transaction = require("../controllers/transaction.controller");

const router = express.Router();

router.route("/").get(transaction.findAll).post(transaction.create);

router
  .route("/:id")
  .get(transaction.findOne)
  .put(transaction.update)
  .delete(transaction.delete);

module.exports = router;
