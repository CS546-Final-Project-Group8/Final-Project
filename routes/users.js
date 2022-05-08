const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const users = require("../data/users.js");
const businesses = require("../data/businesses.js");
const xss = require("xss");

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
      req.body.businessEmail = xss(req.body.businessEmail);
      await validate.checkEmail(req.body.businessEmail);
      let businessEmail = req.body.businessEmail.toLowerCase().trim();
      req.body.email = xss(req.body.email);
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
      req.body.password = xss(req.body.password);
      await validate.checkPassword(req.body.password);
      let password = req.body.password.trim();
      const result = await users.checkEmployee(businessEmail, email, password);
      if (result.authenticated) {
        req.session.user = email;
        req.session.isAdmin = result.isAdmin;
        req.session.businessId = result.businessId;
        req.session.storeOpen = result.storeOpen;
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
      req.body.comment = xss(req.body.comment);
      await validate.checkString(req.body.comment);
      let comment = req.body.comment.trim();
      // get store status from business
      const storeStatus = await businesses.getStoreStatus(req.session.businessId);
      req.session.storeOpen = storeStatus;
      // get current status from employee
      const currentStatus = await users.getCurrentStatus(req.session.employeeId);
      req.session.employee.currentStatus = currentStatus;
      if (!storeStatus) {
        let shifts = await users.getShifts(req.session.employeeId);
        let timeOffUserEntries = await users.getUserTimeOffEntries(req.session.businessId, req.session.employeeId);
        res.render("home/home", {
          title: "Home",
          user: req.session.user,
          isAdmin: req.session.isAdmin,
          businessId: req.session.businessId,
          employeeId: req.session.employeeId,
          employee: req.session.employee,
          shifts: shifts,
          timeOffUserEntries: timeOffUserEntries,
          error: "Store is closed",
        });
        return;
      }
      const result = await users.clockIn(req.session.employeeId, comment);

      if (result.succeeded) {
        req.session.employee.currentStatus = "clockedIn";
        res.redirect("/home");
      } else {
        let shifts = await users.getShifts(req.session.employeeId);
        let timeOffUserEntries = await users.getUserTimeOffEntries(req.session.businessId, req.session.employeeId);
        // render error in home page
        res.render("home/home", {
          title: "Home",
          user: req.session.user,
          isAdmin: req.session.isAdmin,
          businessId: req.session.businessId,
          employeeId: req.session.employeeId,
          employee: req.session.employee,
          shifts: shifts,
          timeOffUserEntries: timeOffUserEntries,
          error: "Could not clock in, please try again.",
        });
      }
    } else {
      res.redirect("/home");
    }
  } catch (e) {
    let shifts = await users.getShifts(req.session.employeeId);
    let timeOffUserEntries = await users.getUserTimeOffEntries(req.session.businessId, req.session.employeeId);
    res.status(400).render("home/home", {
      title: "Home",
      user: req.session.user,
      isAdmin: req.session.isAdmin,
      businessId: req.session.businessId,
      employeeId: req.session.employeeId,
      employee: req.session.employee,
      shifts: shifts,
      timeOffUserEntries: timeOffUserEntries,
      error: e,
    });
  }
});

router.post("/clockOut", async (req, res) => {
  try {
    if (!req.session.isBusiness && req.session.user) {
      req.body.comment = xss(req.body.comment);
      await validate.checkString(req.body.comment);
      let comment = req.body.comment.trim();

      // get current status from employee
      const currentStatus = await users.getCurrentStatus(req.session.employeeId);
      req.session.employee.currentStatus = currentStatus;

      const result = await users.clockOut(req.session.employeeId, comment);

      if (result.succeeded) {
        req.session.employee.currentStatus = "clockedOut";
        res.redirect("/home");
      } else {
        let shifts = await users.getShifts(req.session.employeeId);
        let timeOffUserEntries = await users.getUserTimeOffEntries(req.session.businessId, req.session.employeeId);
        // render error in home page
        res.render("home/home", {
          title: "Home",
          user: req.session.user,
          isAdmin: req.session.isAdmin,
          businessId: req.session.businessId,
          employeeId: req.session.employeeId,
          employee: req.session.employee,
          shifts: shifts,
          error: "Could not clock out, please try again.",
          timeOffUserEntries: timeOffUserEntries,
        });
      }
    } else {
      res.redirect("/home");
    }
  } catch (e) {
    let shifts = await users.getShifts(req.session.employeeId);
    if (req.session.employee.currentStatus === "clockedOut") {
      e = "You are clocked out, either store is closed or you are inactive.";
    }
    res.status(400).render("home/home", {
      title: "Home",
      user: req.session.user,
      isAdmin: req.session.isAdmin,
      businessId: req.session.businessId,
      employeeId: req.session.employeeId,
      employee: req.session.employee,
      shifts: shifts,
      error: e,
    });
  }
});

router.post("/clockOutLunch", async (req, res) => {
  try {
    if (!req.session.isBusiness && req.session.user) {
      req.body.comment = xss(req.body.comment);
      await validate.checkString(req.body.comment);
      let comment = req.body.comment.trim();

      // get current status from employee
      const currentStatus = await users.getCurrentStatus(req.session.employeeId);
      req.session.employee.currentStatus = currentStatus;

      const result = await users.clockOutLunch(req.session.employeeId, comment);

      if (result.succeeded) {
        req.session.employee.currentStatus = "meal";
        res.redirect("/home");
      } else {
        let shifts = await users.getShifts(req.session.employeeId);
        let timeOffUserEntries = await users.getUserTimeOffEntries(req.session.businessId, req.session.employeeId);
        // render error in home page
        res.render("home/home", {
          title: "Home",
          user: req.session.user,
          isAdmin: req.session.isAdmin,
          businessId: req.session.businessId,
          employeeId: req.session.employeeId,
          employee: req.session.employee,
          shifts: shifts,
          timeOffUserEntries: timeOffUserEntries,
          error: result.e ?? "Could not clock out lunch, please try again.",
        });
      }
    } else {
      res.redirect("/home");
    }
  } catch (e) {
    let shifts = await users.getShifts(req.session.employeeId);
    if (req.session.employee.currentStatus === "clockedOut") {
      e = "You are clocked out, either store is closed or you are inactive.";
    }
    res.status(400).render("home/home", {
      title: "Home",
      user: req.session.user,
      isAdmin: req.session.isAdmin,
      businessId: req.session.businessId,
      employeeId: req.session.employeeId,
      employee: req.session.employee,
      shifts: shifts,
      error: e,
    });
  }
});

router.post("/clockInLunch", async (req, res) => {
  try {
    if (!req.session.isBusiness && req.session.user) {
      req.body.comment = xss(req.body.comment);
      await validate.checkString(req.body.comment);
      let comment = req.body.comment.trim();

      // get store status from business
      const storeStatus = await businesses.getStoreStatus(req.session.businessId);
      req.session.storeOpen = storeStatus;
      // get current status from employee
      const currentStatus = await users.getCurrentStatus(req.session.employeeId);
      req.session.employee.currentStatus = currentStatus;

      if (!storeStatus) {
        let shifts = await users.getShifts(req.session.employeeId);
        res.render("home/home", {
          title: "Home",
          user: req.session.user,
          isAdmin: req.session.isAdmin,
          businessId: req.session.businessId,
          employeeId: req.session.employeeId,
          employee: req.session.employee,
          shifts: shifts,
          error: "Store is closed",
        });
        return;
      }

      const result = await users.clockInLunch(req.session.employeeId, comment);

      if (result.succeeded) {
        req.session.employee.currentStatus = "clockedIn";
        res.redirect("/home");
      } else {
        let shifts = await users.getShifts(req.session.employeeId);
        // render error in home page
        res.render("home/home", {
          title: "Home",
          user: req.session.user,
          isAdmin: req.session.isAdmin,
          businessId: req.session.businessId,
          employeeId: req.session.employeeId,
          employee: req.session.employee,
          shifts: shifts,
          error: "Could not clock in lunch, please try again.",
        });
      }
    } else {
      res.redirect("/home");
    }
  } catch (e) {
    let shifts = await users.getShifts(req.session.employeeId);
    if (req.session.employee.currentStatus === "clockedOut") {
      e = "You are clocked out, either store is closed or you are inactive.";
    }
    res.status(400).render("home/home", {
      title: "Home",
      user: req.session.user,
      isAdmin: req.session.isAdmin,
      businessId: req.session.businessId,
      employeeId: req.session.employeeId,
      employee: req.session.employee,
      shifts: shifts,
      error: e,
    });
  }
});

module.exports = router;
