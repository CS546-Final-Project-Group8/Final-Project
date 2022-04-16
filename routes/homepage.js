const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");

router.use("/", async (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      title: "Home",
    });
  } else {
    res.redirect("/signup");
  }
});

module.exports = router;
