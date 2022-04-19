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
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
      await validate.checkPassword(req.body.password);
      let password = req.body.password.trim();
      const result = await users.checkEmployee(email, password);
      if (result.authenticated) {
        req.session.user = email;
        req.session.isAdmin = result.isAdmin;
        req.session.businessId = result.businessId;
        req.session.name = "AuthCookie";
        req.session.employeeId = result.employeeID;
        res.redirect("/home");
      } else {
        return res.status(500).render("users/login", {
          email: req.body.email,
          password: req.body.password,
          title: "Login",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      res.status(400).render("users/login", {
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

module.exports = router;
