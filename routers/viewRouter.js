const express = require("express");

const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const termekController = require("../controllers/termekController");

const router = express.Router();

router.get("/login", viewsController.getLogin);
router.get("/signup", viewsController.getSignUp);

router.use(authController.isLoggedIn);
router.get("/", viewsController.getIndex);
router.get("/termek/:slug", viewsController.getDetails);

router.get("/termekek", viewsController.getTermekek);

router.get("/profilom", authController.protect, viewsController.getMe);
router.get("/cart", authController.protect, viewsController.getCart);

//admin
router.get("/termekAttekintes", viewsController.getTermekAttekintes);
router.get(
  "/add",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getAddPage
);
router.get(
  "/termekFeltoltes",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getTermekFeltoltes
);
router.get(
  "/felhasznalok",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getFelhasznalok
);
router.get(
  "/rendelesek",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getRendelesek
);
router.get(
  "/beszallitok",
  authController.protect,
  authController.restrictTo("admin"),
  viewsController.getBeszallitok
);

module.exports = router;
