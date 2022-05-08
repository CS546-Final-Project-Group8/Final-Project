const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const businesses = require("../data/businesses.js");
const { append } = require("express/lib/response");
const xss = require("xss");

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
      req.body.businessName = xss(req.body.businessName);
      await validate.checkString(req.body.businessName);
      let businessName = req.body.businessName.toLowerCase().trim();
      req.body.email = xss(req.body.email);
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
      req.body.password = xss(req.body.password);
      await validate.checkPassword(req.body.password);
      let password = req.body.password.trim();
      req.body.passwordConfirm = xss(req.body.passwordConfirm);
      await validate.checkPassword(req.body.confirmPassword);
      let confirmPassword = req.body.confirmPassword.trim();
      req.body.address = xss(req.body.address);
      await validate.checkString(req.body.address);
      let address = req.body.address.trim();
      req.body.city = xss(req.body.city);
      await validate.checkString(req.body.city);
      let city = req.body.city.trim();
      req.body.state = xss(req.body.state);
      await validate.checkState(req.body.state);
      let state = req.body.state.trim();
      req.body.zip = xss(req.body.zip);
      await validate.checkZip(req.body.zip);
      let zip = req.body.zip.trim();
      req.body.phoneNumber = xss(req.body.phoneNumber);
      await validate.checkPhone(req.body.phoneNumber);
      let phoneNumber = req.body.phoneNumber.trim();
      req.body.about = xss(req.body.about);
      await validate.checkString(req.body.about);
      let about = req.body.about.trim();
      const result = await businesses.createBusiness(businessName, email, password, confirmPassword, address, city, state, zip, phoneNumber, about);
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
          confirmPassword: req.body.confirmPassword,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
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
        confirmPassword: req.body.confirmPassword,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
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
      req.body.email = xss(req.body.email);
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
      req.body.password = xss(req.body.password);
      await validate.checkPassword(req.body.password);
      let password = req.body.password.trim();
      const result = await businesses.checkBusiness(email, password);
      if (result.authenticated) {
        req.session.user = email;
        req.session.isAdmin = true;
        req.session.isBusiness = true;
        req.session.businessId = result.businessID;
        req.session.storeOpen = result.storeStatus;
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

router.put("/getActiveEmployeesData", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      validate.checkID(req.session.businessId);
      let activeEmployeesData = await businesses.getActiveEmployeesData(req.session.businessId);
      if (activeEmployeesData == null) {
        res.status(200).send("");
      } else {
        res.status(200).send(JSON.stringify(activeEmployeesData));
      }
    } catch (e) {
      res.status(400).render("manager/manager", {
        title: "Manager Dashboard",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

router.put("/getEmployeeStatusData", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      validate.checkID(req.session.businessId);
      let activeEmployeesData = await businesses.getEmployeeStatusData(req.session.businessId);
      if (activeEmployeesData == null) {
        res.status(200).send("");
      } else {
        res.status(200).send(JSON.stringify(activeEmployeesData));
      }
    } catch (e) {
      res.status(400).render("manager/manager", {
        title: "Manager Dashboard",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

router.put("/getHistoricalData", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      validate.checkID(req.session.businessId);
      let historicalData = await businesses.getPastPayPeriods(req.session.businessId);
      historicalData = historicalData.reverse();
      numPeriods = historicalData.length;
      if (numPeriods < 2) {
        res.status(200).send("");
      } else {
        let ans = [["Period", "Total Wages", "Total Wages with Lunch"]];
        for (let i = 0; i < numPeriods; i++) {
          let sum = 0;
          let lunchsum = 0;
          historicalData[i].forEach((payCheck) => {
            sum += payCheck.totalPay;
            lunchsum += payCheck.totalPayLunch;
          });
          ans.push([(numPeriods - i - 1).toString(), sum, lunchsum]);
        }
        res.status(200).send(JSON.stringify(ans));
      }
    } catch (e) {
      res.status(400).render("manager/manager", {
        title: "Manager Dashboard",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

module.exports = router;
