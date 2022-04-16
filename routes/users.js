const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const users = require("../data/users.js");

router.get("/signup", async (req, res) => {
  try {
    if (!req.session.user) {
      res.render("users/signup", {
        email: req.body.email ? req.body.email : "",
        password: req.body.password ? req.body.password : "",
        title: "Signup",
      });
    } else {
      res.redirect("/home");
    }
  } catch (e) {
    res.status(400).render("users/signup", {
      email: req.body.email ? req.body.email : "",
      password: req.body.password ? req.body.password : "",
      title: "Signup",
      error: e,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    await validate.checkEmail(req.body.email);
    let email = req.body.email.toLowerCase().trim();
    await validate.checkPassword(req.body.password);
    let password = req.body.password.trim();
    const result = await users.createUser(email, password);
    if (result.employeeInserted) {
      req.session.user = email;
      req.session.name = "AuthCookie";
      res.redirect("/home");
    } else {
      return res.status(500).render("users/signup", {
        email: req.body.email,
        password: req.body.password,
        title: "Signup",
        error: "Internal Server Error",
      });
    }
  } catch (e) {
    res.status(400).render("users/signup", {
      email: req.body.email,
      password: req.body.password,
      title: "Signup",
      error: e,
    });
  }
});

router.get("/login", async (req, res) => {
  try {
    if (!req.session.user) {
      res.render("users/login", {
        email: req.body.email ? req.body.email : "",
        password: req.body.password ? req.body.password : "",
        title: "Login",
      });
    } else {
      res.redirect("/home");
    }
  } catch (e) {
    res.status(400).render("users/login", {
      email: req.body.email ? req.body.email : "",
      password: req.body.password ? req.body.password : "",
      title: "Login",
      error: e,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    await validate.checkEmail(req.body.email);
    let email = req.body.email.toLowerCase().trim();
    await validate.checkPassword(req.body.password);
    let password = req.body.password.trim();
    const result = await users.checkUser(email, password);
    if (result.authenticated) {
      req.session.user = email;
      req.session.name = "AuthCookie";
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
    res.status(500).render("users/signup", {
      email: req.body.email,
      password: req.body.password,
      title: "Signup",
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
