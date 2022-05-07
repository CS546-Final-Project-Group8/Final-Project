const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const users = require("../data/users.js");
const businesses = require("../data/businesses.js");

router.get("/", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      validate.checkID(req.session.businessId);
      let allEmployees = await users.getAllEmployees(req.session.businessId);
      let pastCalculations = await businesses.getPastPayPeriods(req.session.businessId);

      const employeeNames = allEmployees.map((employee) => {
        return employee.firstName + " " + employee.lastName;
      });

      res.render("manager/manager", {
        user: req.session.user,
        isAdmin: req.session.isAdmin,
        isBusiness: req.session.isBusiness,
        storeOpen: req.session.storeOpen,
        title: "Manager Dashboard",
        allEmployees: allEmployees,
        employeeNames: employeeNames,
        pastCalculations: pastCalculations,
      });
    } catch (e) {
      res.status(400).render("manager/manager", {
        user: req.session.user,
        isAdmin: req.session.isAdmin,
        isBusiness: req.session.isBusiness,
        storeOpen: req.session.storeOpen,
        title: "Manager Dashboard",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

router.post("/", async (req, res) => {
  if (req.session.isAdmin && req.body.calculation !== null) {
    try {
      validate.checkID(req.session.businessId);
      let allEmployees = await users.getAllEmployees(req.session.businessId);
      let pastCalculations = await businesses.getPastPayPeriods(req.session.businessId);

      const employeeNames = allEmployees.map((employee) => {
        return employee.firstName + " " + employee.lastName;
      });

      calculationDate = req.body.calculationDate;
      let payChecks = [];
      pastCalculations.forEach((calculation) => {
        if (calculationDate === calculation[0].date) {
          payChecks = calculation;
        }
      });

      res.render("manager/manager", {
        user: req.session.user,
        isAdmin: req.session.isAdmin,
        isBusiness: req.session.isBusiness,
        storeOpen: req.session.storeOpen,
        title: "Manager Dashboard",
        allEmployees: allEmployees,
        employeeNames: employeeNames,
        pastCalculations: pastCalculations,
        payChecks: payChecks,
      });
    } catch (e) {
      res.status(400).render("manager/manager", {
        user: req.session.user,
        isAdmin: req.session.isAdmin,
        isBusiness: req.session.isBusiness,
        storeOpen: req.session.storeOpen,
        title: "Manager Dashboard",
        error: e,
      });
    }
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
      await validate.checkZip(req.body.zip);
      let zip = req.body.zip.trim();
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
        zip,
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
        address: req.body.address,
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
      await validate.checkID(req.body.employeeId);
      let employeeId = req.body.employeeId.toLowerCase().trim();

      const result = await users.promoteEmployee(employeeId);
      if (result.employeePromoted) {
        res.status(200).send("Employee promoted");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (e) {
      res.status(400).json({ error: e });
    }
  } else {
    res.redirect("/home");
  }
});

router.put("/demoteEmployee", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      await validate.checkID(req.body.employeeId);
      let employeeId = req.body.employeeId.toLowerCase().trim();

      const result = await users.demoteEmployee(employeeId);

      if (result.employeeDemoted && req.body.employeeId === req.session.employeeId) {
        req.session.isAdmin = false;
        req.session.isEmployee = true;
        res.status(200).send("redirect to home");
      } else if (result.employeeDemoted) {
        res.status(200).send("Employee demoted");
      } else {
        res.redirect("/home");
      }
    } catch (e) {
      res.status(400).json({ error: e });
    }
  } else {
    res.redirect("/home");
  }
});

router.get("/employee/:employee_id", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      await validate.checkID(req.params.employee_id);
      await validate.checkID(req.session.businessId);
      let employee = await users.getEmployee(req.session.businessId, req.params.employee_id);
      res.json(employee);
    } catch (e) {
      res.status(400).render("manager/manager", {
        title: "Employee",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

router.patch("/employee/:employee_id", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
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
      await validate.checkZip(req.body.zip);
      let zip = req.body.zip.trim();
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
      validate.checkID(req.params.employee_id);
      validate.checkID(req.session.businessId);
      let updateResult = await users.updateEmployee(
        req.params.employee_id,
        req.session.businessId,
        email,
        firstName,
        lastName,
        gender,
        address,
        city,
        state,
        zip,
        phone,
        employmentStatus,
        isActiveEmployee,
        hourlyPay,
        startDate
      );

      if (updateResult.isActiveEmployee === false && updateResult.currentStatus === "clockedOut") {
        req.session.employee.currentStatus = "clockedOut";
      }
      if (updateResult.isActiveEmployee === false && req.session.employeeId === req.params.employee_id) {
        req.session.isAdmin = false;
        req.session.isEmployee = true;
        updateResult.reload = true;
      }
      if (updateResult) res.status(200).json(updateResult);
      else res.status(500).json({ error: "Internal Server Error" });
    } catch (e) {
      res.status(400).render("manager/manager", {
        title: "Employee",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

router.delete("/employee/:employee_id", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      await validate.checkID(req.params.employee_id);
      let employee_id = req.params.employee_id.toLowerCase().trim();
      if (employee_id === req.session.employeeId) {
        res.status(200).send("You cannot delete yourself");
        return;
      }
      await validate.checkID(req.session.businessId);
      let business_id = req.session.businessId.toLowerCase().trim();
      const deleteResult = await users.deleteEmployee(business_id, employee_id);
      if (deleteResult.succeeded) {
        res.status(200).send("Employee deleted");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (e) {
      res.status(400).render("manager/manager", {
        title: "Employee",
        error: e,
      });
    }
  } else {
    res.redirect("/home");
  }
});

router.post("/calculate", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      let businessId = req.session.businessId;
      await validate.checkID(businessId);

      let payChecks = await businesses.calculatePay(businessId);

      let pastCalculations = await businesses.getPastPayPeriods(businessId);

      let allEmployees = await users.getAllEmployees(req.session.businessId);

      const employeeNames = allEmployees.map((employee) => {
        return employee.firstName + " " + employee.lastName;
      });

      if (payChecks.length > 0) {
        res.render("manager/manager", {
          user: req.session.user,
          isAdmin: req.session.isAdmin,
          isBusiness: req.session.isBusiness,
          title: "Manager Dashboard",
          allEmployees: allEmployees,
          employeeNames: employeeNames,
          payChecks: payChecks,
          pastCalculations: pastCalculations,
        });
      } else {
        res.render("manager/manager", {
          user: req.session.user,
          isAdmin: req.session.isAdmin,
          isBusiness: req.session.isBusiness,
          title: "Manager Dashboard",
          allEmployees: allEmployees,
          employeeNames: employeeNames,
          payChecks: payChecks,
          pastCalculations: pastCalculations,
          error: "No shifts worked since last calculation.",
        });
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

router.put("/toggleStoreStatus", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      await validate.checkID(req.session.businessId);
      let businessId = req.session.businessId.toLowerCase().trim();
      const toggleResult = await businesses.toggleStoreStatus(businessId);
      if (toggleResult.storeOpen) {
        req.session.storeOpen = true;
        res.status(200).send("Store Opened");
      } else {
        req.session.storeOpen = false;
        req.session.employee.currentStatus = "clockedOut";
        res.status(200).send("Store Closed");
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
