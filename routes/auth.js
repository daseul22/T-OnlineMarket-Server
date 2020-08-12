const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportSetup = require("../google-utils/index");
const { tokenGenetator } = require("../jwt-utils/index");

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/redirect",
  passport.authenticate("google", { session: false }),
  function (req, res) {
    let { user } = req;
    let token = tokenGenetator(user, req);
    res.cookie("user", token);
    res.status(201).send({
      userInfo: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        user_type: user.user_type,
      },
    });
  }
);

module.exports = router;
