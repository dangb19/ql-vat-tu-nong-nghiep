const express = require("express");

const user = require("../controllers/user.controller");

const router = express.Router();

router.route("/").get(user.getUsers);

router.route("/signup").post(user.signup);
router.route("/login").post(user.login);
router.route("/profile").get(user.getProfile);
router.route("/logout").get(user.logout);
router.route("/status").put(user.toggleStatus);

router.route("/:id").get(user.findOne).put(user.update).delete(user.delete);

module.exports = router;
