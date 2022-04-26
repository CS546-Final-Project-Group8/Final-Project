const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const businesses = require("../data/businesses.js");
const { append } = require("express/lib/response");

router.get("/signup", async (req, res) => {
  if (!req.session.user) {
    try {
      res.render("businesses/signup", {
        title: "Business Signup",
      });
    } catch (e) {
      res.status(400).render("businesses/signup", {
        title: "Business Signup",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

router.post("/signup", async (req, res) => {
  if (!req.session.user) {
    try {
      await validate.checkString(req.body.businessName);
      let businessName = req.body.businessName.toLowerCase().trim();
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
      await validate.checkPassword(req.body.password);
      let password = req.body.password.trim();
      await validate.checkString(req.body.address);
      let address = req.body.address.trim();
      await validate.checkString(req.body.city);
      let city = req.body.city.trim();
      await validate.checkState(req.body.state);
      let state = req.body.state.trim();
      await validate.checkPhone(req.body.phoneNumber);
      let phoneNumber = req.body.phoneNumber.trim();
      await validate.checkString(req.body.about);
      let about = req.body.about.trim();
      const result = await businesses.createBusiness(
        businessName,
        email,
        password,
        address,
        city,
        state,
        phoneNumber,
        about
      );
      if (result.businessInserted) {
        req.session.user = email;
        req.session.businessId = result.businessID;
        req.session.isAdmin = true;
        req.session.isBusiness = true;
        req.session.name = "AuthCookie";
        res.redirect("/home");
      } else {
        return res.status(500).render("businesses/signup", {
          businessName: req.body.businessName,
          email: req.body.email,
          password: req.body.password,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          phoneNumber: req.body.phoneNumber,
          about: req.body.about,
          title: "Business Signup",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      res.status(400).render("businesses/signup", {
        businessName: req.body.businessName,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        phoneNumber: req.body.phoneNumber,
        about: req.body.about,
        title: "Business Signup",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

router.get("/login", async (req, res) => {
  if (!req.session.user) {
    try {
      res.render("businesses/login", {
        title: "Business Login",
      });
    } catch (e) {
      res.status(400).render("businesses/login", {
        title: "Business Login",
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
      const result = await businesses.checkBusiness(email, password);
      if (result.authenticated) {
        req.session.user = email;
        req.session.isAdmin = true;
        req.session.isBusiness = true;
        req.session.businessId = result.businessID;
        req.session.name = "AuthCookie";
        res.redirect("/home");
      } else {
        return res.status(401).render("businesses/login", {
          email: req.body.email,
          password: req.body.password,
          title: "Business Login",
          error: "Invalid Credentials",
        });
      }
    } catch (e) {
      res.status(400).render("businesses/login", {
        email: req.body.email,
        password: req.body.password,
        title: "Business Login",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

module.exports = router;