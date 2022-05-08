const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const users = require("../data/users.js");
const xss = require("xss");

router.get("/", async (req, res) => {
  try {
    if (req.session.user && !req.session.isBusiness) {
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

router.post("/", async (req, res) => {
  try {
    if (req.session.user && !req.session.isBusiness) {
      req.body.timeOffStartDate = xss(req.body.timeOffStartDate);
      await validate.checkTimeOffDateFormat(req.body.timeOffStartDate);
      let startDate = req.body.timeOffStartDate;
      req.body.timeOffEndDate = xss(req.body.timeOffEndDate);
      await validate.checkTimeOffDateFormat(req.body.timeOffEndDate);
      let endDate = req.body.timeOffEndDate;
      await validate.checkTimeOffDates(startDate, endDate);
      let businessId = req.session.businessId.toLowerCase().trim();
      let employeeId = req.session.employeeId;
      let employeeName = req.session.employee.firstName + " " + req.session.employee.lastName;
      const newTimeEntry = await users.addTimeOffEntry(businessId, employeeId, employeeName, startDate, endDate);
      if (newTimeEntry) {
        res.redirect("/home");
      } else throw "Time off request unsuccessful";
    } else if (req.session.user && req.session.isBusiness) {
      res.redirect("/manager");
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    res.redirect("/login");
  }
});

router.put("/userTimeOffDelete", async (req, res) => {
  try {
    if (req.session.user && !req.session.isBusiness) {
      req.body.objId = xss(req.body.objId);
      await validate.checkID(req.body.objId);
      let objId = req.body.objId.toLowerCase().trim();
      await validate.checkID(req.session.businessId);
      let businessId = req.session.businessId.toLowerCase().trim();
      const result = await users.deleteTimeOffRequest(objId, businessId);
      if (result.requestStatus) {
        res.status(200).send("Request deleted");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } else if (req.session.user && req.session.isBusiness) {
      res.redirect("/manager");
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
