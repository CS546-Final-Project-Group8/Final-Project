const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const users = require("../data/users.js");

router.get("/", async (req, res) => {
  if (req.session.user) {
    let allEmployees = await users.getAllEmployees();
    console.log(allEmployees);
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
  try {
    await validate.checkEmail(req.body.email);
    let email = req.body.email.toLowerCase().trim();
    await validate.checkPassword(req.body.password);
    let password = req.body.password.trim();
    const result = await users.createEmployee(email, password);
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
});

module.exports = router;
