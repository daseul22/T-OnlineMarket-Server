const express = require("express");
const router = express.Router();
const { userController } = require("../controllers/index");
const { jwtVerification } = require("../jwt-utils/index");

router.post("/login", userController.login.post);
router.post("/signup", userController.signup.post);
router.post("/signout", jwtVerification, userController.signout.post);
router.post("/emailcheck", userController.emailCheck.post);
router.post("/certification", userController.certification.post);
router.post("/resign", userController.resign.post);
router.post("/edituserinfo", jwtVerification, userController.editUserInfo.post);

module.exports = router;
