const express = require("express");
const router = express.Router();

const termekController = require("../controllers/termekController");
const authController = require("../controllers/authController");

router.get("/allTermek", termekController.getAllTermek); //mindenkinek
router.get("/termek/:slug", termekController.getTermek);
router.post(
  "/createTermek",
  authController.protect,
  authController.restrictTo("admin"),
  termekController.uploadPhoto,
  termekController.modifyPaintingPhoto,
  termekController.createTermek
); //restrict to admin
router.patch("/updateTermek", termekController.updateTermek);

module.exports = router;
