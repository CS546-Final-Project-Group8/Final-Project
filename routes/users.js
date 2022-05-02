const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const users = require("../data/users.js");

router.get("/", async (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.redirect("/login");
  }
});

router.get("/login", async (req, res) => {
  if (!req.session.user) {
    try {
      res.render("users/login", {
        email: req.body.email ? req.body.email : "",
        password: req.body.password ? req.body.password : "",
        title: "Login",
      });
    } catch (e) {
      res.status(400).render("users/login", {
        email: req.body.email ? req.body.email : "",
        password: req.body.password ? req.body.password : "",
        title: "Login",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

router.post("/login", async (req, res) => {
  if (!req.session.user) {
    try {
      await validate.checkEmail(req.body.businessEmail);
      let businessEmail = req.body.businessEmail.toLowerCase().trim();
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
      await validate.checkPassword(req.body.password);
      let password = req.body.password.trim();
      const result = await users.checkEmployee(businessEmail, email, password);
      if (result.authenticated) {
        req.session.user = email;
        req.session.isAdmin = result.isAdmin;
        req.session.businessId = result.businessId;
        req.session.name = "AuthCookie";
        req.session.employeeId = result.employeeID;
        req.session.employee = result.employee;
        res.redirect("/home");
      } else {
        return res.status(500).render("users/login", {
          businessEmail: req.body.businessEmail,
          email: req.body.email,
          password: req.body.password,
          title: "Login",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      res.status(400).render("users/login", {
        businessEmail: req.body.businessEmail,
        email: req.body.email,
        password: req.body.password,
        title: "Login",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

router.get("/logout", async (req, res) => {
  try {
    if (req.session.user) {
      req.session.destroy();
    }
    res.render("users/logout", {
      title: "Logout",
    });
  } catch (e) {
    res.status(500).redirect("/login");
  }
});

router.post("/clockIn", async (req, res) => {
  try {
    if (!req.session.isBusiness && req.session.user) {
      await validate.checkString(req.body.comment);
      const result = await users.clockIn(req.session.employeeId, req.body.comment);

      if (result.succeeded) {
        req.session.employee.currentStatus = "clockedIn";
        res.redirect("/home");
      } else {
        // render error in home page
        res.render("home/home", {
          title: "Home",
          user: req.session.user,
          isAdmin: req.session.isAdmin,
          businessId: req.session.businessId,
          employeeId: req.session.employeeId,
          employee: req.session.employee,
          error: "Could not clock in, please try again.",
        });
      }
    } else {
      res.redirect("/home");
    }
  } catch (e) {
    res.status(400).redirect("/home");
  }
});

router.post("/clockOut", async (req, res) => {
  try {
    if (!req.session.isBusiness && req.session.user) {
      await validate.checkString(req.body.comment);
      const result = await users.clockOut(req.session.employeeId, req.body.comment);

      if (result.succeeded) {
        req.session.employee.currentStatus = "clockedOut";
        res.redirect("/home");
      } else {
        // render error in home page
        res.render("home/home", {
          title: "Home",
          user: req.session.user,
          isAdmin: req.session.isAdmin,
          businessId: req.session.businessId,
          employeeId: req.session.employeeId,
          employee: req.session.employee,
          error: "Could not clock out, please try again.",
        });
      }
    } else {
      res.redirect("/home");
    }
  } catch (e) {
    res.status(400).redirect("/home");
  }
});

module.exports = router;
