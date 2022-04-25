const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");

router.use("/", async (req, res) => {
  if (req.session.user) {
    res.render("home/home", {
      user: req.session.user,
      isAdmin: req.session.isAdmin,
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
