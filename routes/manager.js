const express = require("express");
const router = express.Router();
const validate = require("../validate/index.js");
const users = require("../data/users.js");
const businesses = require("../data/businesses.js");
const xss = require("xss");

router.get("/", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      validate.checkID(req.session.businessId);
      let allEmployees = await users.getAllEmployees(req.session.businessId);
      let allTimeOffRequests = await users.getTimeOffEntries(req.session.businessId);
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
        timeOffRequests: allTimeOffRequests,
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

router.get("/businessInfo", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      await validate.checkID(req.session.businessId);
      let businessInfo = await businesses.getBusiness(req.session.businessId);
      res.json(businessInfo);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  } else {
    res.redirect("/home");
  }
});

router.patch("/updateBusinessInfo", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      await validate.checkID(req.session.businessId);
      let businessId = req.session.businessId.toLowerCase().trim();
      req.body.businessName = xss(req.body.businessName);
      await validate.checkString(req.body.businessName);
      let businessName = req.body.businessName.trim();
      req.body.email = xss(req.body.email);
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
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
      let phone = req.body.phoneNumber.trim();
      req.body.about = xss(req.body.about);
      await validate.checkString(req.body.about);
      let about = req.body.about.trim();
      const result = await businesses.updateBusinessInfo(businessId, businessName, email, address, city, state, zip, phone, about);

      if (result) {
        res.status(200).send("Business update success");
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

router.post("/", async (req, res) => {
  req.body.calculation = xss(req.body.calculation);
  if (req.session.isAdmin && req.body.calculation !== null) {
    try {
      validate.checkID(req.session.businessId);
      let allEmployees = await users.getAllEmployees(req.session.businessId);
      let pastCalculations = await businesses.getPastPayPeriods(req.session.businessId);

      const employeeNames = allEmployees.map((employee) => {
        return employee.firstName + " " + employee.lastName;
      });

      let calculationDate = req.body.calculationDate;
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
      req.body.email = xss(req.body.email);
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
      req.body.password = xss(req.body.password);
      await validate.checkPassword(req.body.password);
      let password = req.body.password.trim();
      req.body.confirmPassword = xss(req.body.confirmPassword);
      await validate.checkPassword(req.body.confirmPassword);
      let confirmPassword = req.body.confirmPassword.trim();
      req.body.firstName = xss(req.body.firstName);
      await validate.checkString(req.body.firstName);
      let firstName = req.body.firstName.trim();
      req.body.lastName = xss(req.body.lastName);
      await validate.checkString(req.body.lastName);
      let lastName = req.body.lastName.trim();
      req.body.gender = xss(req.body.gender);
      await validate.checkGender(req.body.gender);
      let gender = req.body.gender.trim();
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
      let phone = req.body.phoneNumber.trim();
      req.body.hourlyPay = xss(req.body.hourlyPay);
      await validate.checkNumber(req.body.hourlyPay);
      let hourlyPay = parseInt(req.body.hourlyPay);
      req.body.startDate = xss(req.body.startDate);
      await validate.checkDate(req.body.startDate);
      let startDate = req.body.startDate.trim();
      req.body.employmentStatus = xss(req.body.employmentStatus);
      await validate.checkEmploymentStatus(req.body.employmentStatus);
      let employmentStatus = req.body.employmentStatus.trim();
      req.body.isActiveEmployee = xss(req.body.isActiveEmployee);
      await validate.checkBoolean(req.body.isActiveEmployee);
      let isActiveEmployee = req.body.isActiveEmployee.trim();
      req.body.isManager = xss(req.body.isManager);
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
          title: "Employee Creation",
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
        title: "Employee Creation",
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
      req.body.employeeId = xss(req.body.employeeId);
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
      req.body.employeeId = xss(req.body.employeeId);
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
      req.params.employee_id = xss(req.params.employee_id);
      await validate.checkID(req.params.employee_id);
      let employeeId = req.params.employee_id.toLowerCase().trim();
      await validate.checkID(req.session.businessId);
      let employee = await users.getEmployee(req.session.businessId, employeeId);
      res.json(employee);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  } else {
    res.redirect("/home");
  }
});

router.patch("/employee/:employee_id", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      req.body.email = xss(req.body.email);
      await validate.checkEmail(req.body.email);
      let email = req.body.email.toLowerCase().trim();
      req.body.firstName = xss(req.body.firstName);
      await validate.checkString(req.body.firstName);
      let firstName = req.body.firstName.trim();
      req.body.lastName = xss(req.body.lastName);
      await validate.checkString(req.body.lastName);
      let lastName = req.body.lastName.trim();
      req.body.gender = xss(req.body.gender);
      await validate.checkGender(req.body.gender);
      let gender = req.body.gender.trim();
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
      let phone = req.body.phoneNumber.trim();
      req.body.hourlyPay = xss(req.body.hourlyPay);
      await validate.checkNumber(req.body.hourlyPay);
      let hourlyPay = parseInt(req.body.hourlyPay);
      req.body.startDate = xss(req.body.startDate);
      await validate.checkDate(req.body.startDate);
      let startDate = req.body.startDate.trim();
      req.body.employmentStatus = xss(req.body.employmentStatus);
      await validate.checkEmploymentStatus(req.body.employmentStatus);
      let employmentStatus = req.body.employmentStatus.trim();
      req.body.isActiveEmployee = xss(req.body.isActiveEmployee);
      await validate.checkBoolean(req.body.isActiveEmployee);
      let isActiveEmployee = req.body.isActiveEmployee.trim();
      req.params.employee_id = xss(req.params.employee_id);
      validate.checkID(req.params.employee_id);
      let employeeId = req.params.employee_id.toLowerCase().trim();
      validate.checkID(req.session.businessId);
      let updateResult = await users.updateEmployee(
        employeeId,
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

      if (updateResult.isActiveEmployee === false && updateResult.currentStatus === "clockedOut" && !req.session.isBusiness) {
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
      res.status(400).json({ error: e });
    }
  } else {
    res.redirect("/home");
  }
});

router.delete("/employee/:employee_id", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      req.params.employee_id = xss(req.params.employee_id);
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
      res.status(400).json({ error: e });
    }
  } else {
    res.redirect("/home");
  }
});

router.put("/acceptTimeOffRequest", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      req.body.objId = xss(req.body.objId);
      await validate.checkID(req.body.objId);
      let objId = req.body.objId.toLowerCase().trim();
      await validate.checkID(req.session.businessId);
      let businessId = req.session.businessId.toLowerCase().trim();
      const result = await users.acceptTimeOffRequest(objId, businessId);
      if (result.requestStatus) {
        res.status(200).send("Request accepted");
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

router.put("/declineTimeOffRequest", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      req.body.objId = xss(req.body.objId);
      await validate.checkID(req.body.objId);
      let objId = req.body.objId.toLowerCase().trim();
      await validate.checkID(req.session.businessId);
      let businessId = req.session.businessId.toLowerCase().trim();
      const result = await users.declineTimeOffRequest(objId, businessId);
      if (result.requestStatus) {
        res.status(200).send("Request declined");
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

router.post("/calculate", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      validate.checkID(req.session.businessId);
      let payChecks = await businesses.calculatePay(req.session.businessId);
      let allEmployees = await users.getAllEmployees(req.session.businessId);
      let allTimeOffRequests = await users.getTimeOffEntries(req.session.businessId);
      let pastCalculations = await businesses.getPastPayPeriods(req.session.businessId);

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
          timeOffRequests: allTimeOffRequests,
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
          timeOffRequests: allTimeOffRequests,
          pastCalculations: pastCalculations,
          error: "No active time entries available",
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
        if (req.session.employee) {
          req.session.employee.currentStatus = "clockedOut";
        }
        res.status(200).send("Store Closed");
      }
    } catch (e) {
      res.status(400).json({ error: e });
    }
  } else {
    res.redirect("/home");
  }
});

router.put("/estimateWages", async (req, res) => {
  if (req.session.isAdmin) {
    try {
      await validate.checkID(req.session.businessId);
      let businessId = req.session.businessId.toLowerCase().trim();
      const estimate = await businesses.estimateWages(businessId);
      if (estimate.succeeded) {
        res
          .status(200)
          .send(
            "Shift hours since last calculation: " +
              estimate.totalHoursString +
              " and " +
              estimate.totalLunchHoursString +
              " hours with lunch. Estimated total pay: $" +
              estimate.totalPay.toFixed(2) +
              " or $" +
              estimate.totalPayLunch.toFixed(2) +
              " including lunch."
          );
      } else {
        res.status(200).send("Could not calculate estimate.");
      }
    } catch (e) {
      res.status(400).json({ error: e });
    }
  } else {
    res.redirect("/home");
  }
});

module.exports = router;
