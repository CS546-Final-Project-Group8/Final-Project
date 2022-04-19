const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const users = require("../data/users.js");

router.get("/", async (req, res) => {
  if (req.session.user) {
    validate.checkID(req.session.businessId);
    let allEmployees = await users.getAllEmployees(req.session.businessId);
    res.render("employee/employee", {
      user: req.session.user,
      title: "Employee",
      allEmployees: allEmployees,
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/new", async (req, res) => {
  if (req.session.user) {
    try {
      await validate.checkID(req.session.businessId);
      let businessId = req.session.businessId;
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
      await validate.checkPassword(req.body.password);
      let password = req.body.password.trim();
      await validate.checkString(req.body.firstName);
      let firstName = req.body.firstName.trim();
      await validate.checkString(req.body.lastName);
      let lastName = req.body.lastName.trim();
      await validate.checkGender(req.body.gender);
      let gender = req.body.gender.trim();
      await validate.checkString(req.body.address);
      let address = req.body.address.trim();
      await validate.checkString(req.body.city);
      let city = req.body.city.trim();
      await validate.checkState(req.body.state);
      let state = req.body.state.trim();
      await validate.checkPhone(req.body.phoneNumber);
      let phone = req.body.phoneNumber.trim();
      await validate.checkNumber(req.body.hourlyPay);
      let hourlyPay = parseInt(req.body.hourlyPay);
      // await validate.checkDate(req.body.startDate); //pending
      let startDate = req.body.startDate.trim();
      await validate.checkBoolean(req.body.isManager);
      let isManager = req.body.isManager.trim();
      const result = await users.createEmployee(
        businessId,
        email,
        password,
        firstName,
        lastName,
        gender,
        address,
        city,
        state,
        phone,
        hourlyPay,
        startDate,
        isManager
      );
      if (result.employeeInserted) {
        req.session.user = email;
        req.session.name = "AuthCookie";
        res.redirect("/employee");
      } else {
        return res.status(500).render("employee/employee", {
          email: req.body.email,
          password: req.body.password,
          title: "Employee",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      res.status(400).render("employee/employee", {
        email: req.body.email,
        password: req.body.password,
        title: "Employee",
        error: e,
      });
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
