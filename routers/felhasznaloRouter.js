const express = require("express");

const felhasznaloController = require("../controllers/felhasznaloController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/logout", authController.logout);

router.get(
  "/allUsers",
  authController.protect,
  authController.restrictTo("admin"),
  felhasznaloController.getAllUsers
);
router.post("/createUser", felhasznaloController.createUser);
router.patch(
  "/updateMe",
  authController.protect,
  felhasznaloController.updateMe
);

module.exports = router;
