const express = require("express");
const router = express.Router();
const { mypageController } = require("../controllers/index");
const { jwtVerification } = require("../jwt-utils/index");

router.get("/purchase", jwtVerification, mypageController.purchase.get);
router.get(
  "/purchase/tracking",
  jwtVerification,
  mypageController.tracking.get
);
router.get("/sale", jwtVerification, mypageController.sale.get);
router.get("/onsale", jwtVerification, mypageController.onsale.get);
router.post("/confirm", jwtVerification, mypageController.confirm.post);
router.post("/ordercheck", jwtVerification, mypageController.ordercheck.post);
router.post("/order", jwtVerification, mypageController.order.post);

module.exports = router;
