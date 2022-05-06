const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const users = require("../data/users.js");

router.use("/", async (req, res) => {
  try {
    if (req.session.user && !req.session.isBusiness) {
      let shifts = await users.getShifts(req.session.employeeId);
      res.render("home/home", {
        title: "Home",
        user: req.session.user,
        isAdmin: req.session.isAdmin,
        businessId: req.session.businessId,
        employeeId: req.session.employeeId,
        employee: req.session.employee,
        shifts: shifts,
      });
    } else if (req.session.user && req.session.isBusiness) {
      res.redirect("/manager");
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    res.redirect("/login");
  }
});

module.exports = router;
