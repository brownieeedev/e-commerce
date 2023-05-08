const express = require("express");
const multer = require("multer");

const rendelesController = require("../controllers/rendelesController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/cart/add/:slug",
  authController.protect,
  rendelesController.addToCart
);

router.post("/saveCart", authController.protect, rendelesController.saveToCart);
router.patch(
  "/remove/:id",
  authController.protect,
  rendelesController.removeFromCart
);

router.get("/cart", authController.protect, rendelesController.getCart);

// router.delete(
//   '/cart/:slug',
//   authController.protect,
//   rendelesController.removeFromCart
// );

// router.get(
//   '/checkout-session/:sum',
//   authController.protect,
//   rendelesController.getCheckoutSession
// );

// router.use(authController.protect, authController.restrictTo("admin"));

// router
//   .route("/")
//   .get(rendelesController.getAllRendeles)
//   .post(rendelesController.createRendeles);
// router
//   .route("/:id")
//   .get(rendelesController.getRendeles)
//   .patch(rendelesController.updateRendeles)
//   .delete(rendelesController.deleteRendeles);

module.exports = router;
