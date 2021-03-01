const express = require("express");
const { reset } = require("nodemon");
const router = express.Router();
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "openid", "email"],
  })
);
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  console.log(req.user);
  res.redirect("/");
});

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    session: false,
    scope: ["public_profile"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    console.log(res);
    res.send(req.user);
    res.redirect("/");
  }
);

router.get("/profile", (req, res) => {
  res.send(req.user);
});

module.exports = router;
