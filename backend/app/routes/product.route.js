const express = require("express");

const product = require("../controllers/product.controller");

const router = express.Router();

router.route("/").get(product.getProducts).post(product.create);
router.route("/product-info").get(product.getProductInfo);
router.route("/product-stats").get(product.countProductStats);

router
  .route("/:id")
  .get(product.getProductWithDetails)
  .put(product.update)
  .delete(product.delete);

router.route("/:id/update-discount").put(product.updateDiscount);
router.route("/:id/remove-discount").put(product.removeDiscount);

module.exports = router;
