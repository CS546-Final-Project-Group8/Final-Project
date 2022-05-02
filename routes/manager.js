const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const users = require("../data/users.js");

router.get("/", async (req, res) => {
  if (req.session.isAdmin) {
    validate.checkID(req.session.businessId);
    let allEmployees = await users.getAllEmployees(req.session.businessId);

    const employeeNames = allEmployees.map((employee) => {
      return employee.firstName + " " + employee.lastName;
    });

    res.render("manager/manager", {
      user: req.session.user,
      isAdmin: req.session.isAdmin,
      isBusiness: req.session.isBusiness,
      title: "Manager Dashboard",
      allEmployees: allEmployees,
      employeeNames: employeeNames,
    });
  } else {
    res.redirect("/home");
  }
});

router.post("/new", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      await validate.checkID(req.session.businessId);
      let businessId = req.session.businessId.toLowerCase().trim();
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
      await validate.checkPassword(req.body.password);
      let password = req.body.password.trim();
      await validate.checkPassword(req.body.confirmPassword);
      let confirmPassword = req.body.confirmPassword.trim();
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
      await validate.checkDate(req.body.startDate);
      let startDate = req.body.startDate.trim();
      await validate.checkEmploymentStatus(req.body.employmentStatus);
      let employmentStatus = req.body.employmentStatus.trim();
      await validate.checkBoolean(req.body.isActiveEmployee);
      let isActiveEmployee = req.body.isActiveEmployee.trim();
      await validate.checkBoolean(req.body.isManager);
      let isManager = req.body.isManager.trim();
      const result = await users.createEmployee(
        businessId,
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        gender,
        address,
        city,
        state,
        phone,
        employmentStatus,
        isActiveEmployee,
        hourlyPay,
        startDate,
        isManager
      );
      if (result.employeeInserted) {
        res.redirect("/manager");
      } else {
        return res.status(500).render("manager/manager", {
          email: req.body.email,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          gender: req.body.gender,
          address: req.body.gender,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          phoneNumber: req.body.phoneNumber,
          employmentStatus: req.body.employmentStatus,
          isActiveEmployee: req.body.isActiveEmployee,
          hourlyPay: req.body.hourlyPay,
          startDate: req.body.startDate,
          isManager: req.body.isManager,
          title: "Employee",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      res.status(400).render("manager/manager", {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        address: req.body.gender,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        phoneNumber: req.body.phoneNumber,
        employmentStatus: req.body.employmentStatus,
        isActiveEmployee: req.body.isActiveEmployee,
        hourlyPay: req.body.hourlyPay,
        startDate: req.body.startDate,
        isManager: req.body.isManager,
        title: "Employee",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

router.put("/promoteEmployee", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      await validate.checkID(req.session.businessId);
      let businessId = req.session.businessId.toLowerCase().trim();
      await validate.checkID(req.body.employeeId);
      let employeeId = req.body.employeeId.toLowerCase().trim();

      const result = await users.promoteEmployee(employeeId);
      if (result.employeePromoted) {
        res.status(200).send("Employee promoted");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  } else {
    res.redirect("/home");
  }
});

module.exports = router;
