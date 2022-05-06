const mongoCollections = require("../config/mongoCollections");
const employees = mongoCollections.employees;
const businesses = mongoCollections.businesses;
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const validate = require("../validate/index.js");

// function createEmployee(businessId, email, password, confirmPassword, firstName, lastName, gender,  address, city, state, zip, phone, employmentStatus, isActiveEmployee, hourlyPay, startDate, isManager) this function creates an employee in monogoDB database
let createEmployee = async (
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
) => {
  await validate.checkID(businessId);
  businessId = businessId.toLowerCase().trim();
  await validate.checkEmail(email);
  email = email.toLowerCase().trim();
  await validate.checkPassword(password);
  password = password.trim();
  await validate.checkPassword(confirmPassword);
  confirmPassword = confirmPassword.trim();
  if (password !== confirmPassword) throw "Passwords do not match";
  await validate.checkString(firstName);
  firstName = firstName.trim();
  await validate.checkString(lastName);
  lastName = lastName.trim();
  await validate.checkGender(gender);
  gender = gender.trim();
  await validate.checkString(address);
  address = address.trim();
  await validate.checkString(city);
  city = city.trim();
  await validate.checkState(state);
  state = state.trim();
  await validate.checkZip(zip);
  zip = zip.trim();
  await validate.checkPhone(phone);
  phone = phone.trim();
  await validate.checkNumber(hourlyPay);
  hourlyPay = parseInt(hourlyPay);
  await validate.checkDate(startDate);
  startDate = startDate.trim();
  await validate.checkEmploymentStatus(employmentStatus);
  employmentStatus = employmentStatus.trim();
  await validate.checkBoolean(isActiveEmployee);
  isActiveEmployee = isActiveEmployee.toLowerCase().trim() === "true";
  await validate.checkBoolean(isManager);
  isManager = isManager.toLowerCase().trim() === "true";

  const hash = await bcrypt.hash(password, saltRounds);

  //check if businessId exists
  const businessCollection = await businesses();
  const business = await businessCollection.findOne({
    _id: ObjectId(businessId),
  });
  if (!business) throw "Business not found";

  const employeesCollection = await employees();
  const newEmployee = {
    businessId: businessId,
    email: email,
    hashedPassword: hash,
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    address: address,
    city: city,
    state: state,
    zip: zip,
    phone: phone,
    employmentStatus: employmentStatus,
    isActiveEmployee: isActiveEmployee,
    hourlyPay: hourlyPay,
    startDate: startDate,
    isManager: isManager,
    currentStatus: "clockedOut",
    timeEntries: [],
    timeEntiresOld: [],
  };

  //if businessId and email are unique, create employee
  const employee = await employeesCollection.findOne({
    businessId: businessId,
    email: email,
  });
  if (employee) throw "Employee already exists";

  const insertInfo = await employeesCollection.insertOne(newEmployee);
  if (insertInfo.insertedCount === 0) throw "Could not add employee to database";

  const newEmployeeId = insertInfo.insertedId.toString();

  return { employeeInserted: true, employeeID: newEmployeeId };
};

// function updateEmployee(employeeId, businessId, email, firstName, lastName, gender,  address, city, state, zip, phone, employmentStatus, isActiveEmployee, hourlyPay, startDate) this function updates an employee's account info in monogoDB database
let updateEmployee = async (employeeId, businessId, email, firstName, lastName, gender, address, city, state, zip, phone, employmentStatus, isActiveEmployee, hourlyPay, startDate) => {
  // Validation
  await validate.checkID(employeeId);
  employeeId = employeeId.trim();
  await validate.checkID(businessId);
  businessId = businessId.trim();
  await validate.checkEmail(email);
  email = email.toLowerCase().trim();
  await validate.checkString(firstName);
  firstName = firstName.trim();
  await validate.checkString(lastName);
  lastName = lastName.trim();
  await validate.checkGender(gender);
  gender = gender.trim();
  await validate.checkString(address);
  address = address.trim();
  await validate.checkString(city);
  city = city.trim();
  await validate.checkState(state);
  state = state.trim();
  await validate.checkZip(zip);
  zip = zip.trim();
  await validate.checkPhone(phone);
  phone = phone.trim();
  await validate.checkNumber(hourlyPay);
  hourlyPay = parseInt(hourlyPay);
  await validate.checkDate(startDate);
  startDate = startDate.trim();
  await validate.checkEmploymentStatus(employmentStatus);
  employmentStatus = employmentStatus.trim();
  await validate.checkBoolean(isActiveEmployee);
  isActiveEmployee = isActiveEmployee.toLowerCase().trim() === "true";

  // Check if businessId exists
  const businessCollection = await businesses();
  const business = await businessCollection.findOne({
    _id: ObjectId(businessId),
  });
  if (!business) throw "Business not found";

  // Check employee exists
  const employeesCollection = await employees();
  const employee = await employeesCollection.findOne({
    businessId: businessId,
    _id: ObjectId(employeeId),
  });
  if (!employee) throw "Couldn't update an employee that does not exist";

  if (isActiveEmployee === false && employee.isManager === true) {
    await demoteEmployee(employeeId);
  }

  const updatedEmployee = await employeesCollection.findOneAndUpdate(
    {
      businessId: businessId,
      _id: ObjectId(employeeId),
    },
    {
      $set: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        address: address,
        city: city,
        state: state,
        zip: zip,
        phone: phone,
        employmentStatus: employmentStatus,
        isActiveEmployee: isActiveEmployee,
        hourlyPay: hourlyPay,
        startDate: startDate,
      },
    },
    { returnDocument: "after" }
  );
  if (!updatedEmployee) throw "Couldn't update employee";
  updatedEmployee.value.hashedPassword = null;
  return updatedEmployee.value;
};

// function checkEmployee(businessEmail, email, password) this function checks if the email and password are correct
let checkEmployee = async (businessEmail, email, password) => {
  await validate.checkEmail(businessEmail);
  businessEmail = businessEmail.toLowerCase().trim();
  await validate.checkEmail(email);
  email = email.toLowerCase().trim();
  await validate.checkPassword(password);
  password = password.trim();

  // check if businessEmail exists in mongoDB database and get businessId
  const businessCollection = await businesses();
  const business = await businessCollection.findOne({
    email: businessEmail,
  });
  if (!business) throw "Business not found";
  const businessId = business._id.toString();

  const employeesCollection = await employees();
  // find employee that matches businessEmail and email
  const employee = await employeesCollection.findOne({
    businessId: businessId,
    email: email,
  });
  if (!employee) throw "Either the email or password is invalid";

  const passwordStatus = await bcrypt.compare(password, employee.hashedPassword);

  if (!passwordStatus) throw "Either the email or password is invalid";

  employee.hashedPassword = null;
  employee._id = employee._id.toString();

  return {
    authenticated: true,
    employeeID: employee._id,
    businessId: employee.businessId,
    isAdmin: employee.isManager,
    employee: employee,
  };
};

let getAllEmployees = async (businessId) => {
  await validate.checkID(businessId);
  businessId = businessId.trim();
  const employeesCollection = await employees();
  const Allemployees = await employeesCollection
    .find({
      businessId: businessId,
    })
    .toArray();
  for (const employee of Allemployees) {
    employee._id = employee._id.toString();
    employee.hashedPassword = null;
  }
  return Allemployees;
};

let getEmployee = async (businessId, employeeId) => {
  await validate.checkID(employeeId);
  employeeId = employeeId.trim();
  await validate.checkID(businessId);
  businessId = businessId.trim();
  const employeesCollection = await employees();
  const employee = await employeesCollection.findOne({
    businessId: businessId,
    _id: ObjectId(employeeId),
  });
  if (!employee) throw `Employee with ObjectID: '${employeeId}' was not found.`;
  employee._id = employee._id.toString();
  employee.hashedPassword = null;
  return employee;
};

let deleteEmployee = async (businessId, employeeId) => {
  await validate.checkID(employeeId);
  employeeId = employeeId.trim();
  await validate.checkID(businessId);
  businessId = businessId.trim();
  const employeesCollection = await employees();
  const deleteInfo = await employeesCollection.deleteOne({
    businessId: businessId,
    _id: ObjectId(employeeId),
  });
  if (deleteInfo.deletedCount === 0) throw "Could not delete employee";
  return { succeeded: true };
};

let clockIn = async (employeeId, comment) => {
  await validate.checkID(employeeId);
  employeeId = employeeId.trim();
  await validate.checkString(comment);
  comment = comment.trim();
  const employeeCollection = await employees();
  const employee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (!employee) throw "Employee not found";
  if (employee.isActiveEmployee === false) throw "Employee is not active";

  if (employee.currentStatus !== "clockedOut") {
    throw "Employee must be clocked out to clock in!";
  }
  const userCollection = await employees();
  let userUpdateInfo = {
    currentStatus: "clockedIn",
  };
  const timeEntry = {
    dateTime: new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString(),
    status: "clockIn",
    comment: comment,
  };

  const updateInfo = await userCollection.updateOne({ _id: ObjectId(employeeId) }, { $set: userUpdateInfo, $addToSet: { timeEntries: timeEntry } });
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Update failed";

  return { succeeded: true };
};

let clockOut = async (employeeId, comment) => {
  await validate.checkID(employeeId);
  employeeId = employeeId.trim();
  await validate.checkString(comment);
  comment = comment.trim();
  const employeeCollection = await employees();
  const employee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (!employee) throw "Employee not found";
  if (employee.isActiveEmployee === false) throw "Employee is not active";

  if (!(employee.currentStatus === "clockedIn" || employee.currentStatus === "lunch")) {
    throw "Employee must be clocked in / on lunch break to clock out!";
  }
  const userCollection = await employees();
  let userUpdateInfo = {
    currentStatus: "clockedOut",
  };
  const timeEntry = {
    dateTime: new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString(),
    status: "clockOut",
    comment: comment,
  };
  const updateInfo = await userCollection.updateOne({ _id: ObjectId(employeeId) }, { $set: userUpdateInfo, $addToSet: { timeEntries: timeEntry } });
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Update failed";

  return { succeeded: true };
};

let clockInLunch = async (employeeId, comment) => {
  await validate.checkID(employeeId);
  employeeId = employeeId.trim();
  await validate.checkString(comment);
  comment = comment.trim();
  const employeeCollection = await employees();
  const employee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (!employee) throw "Employee not found";
  if (employee.isActiveEmployee === false) throw "Employee is not active";

  if (employee.currentStatus !== "meal") {
    throw "Employee must be on lunch break to clock in from lunch!";
  }
  const userCollection = await employees();
  let userUpdateInfo = {
    currentStatus: "clockedIn",
  };
  const timeEntry = {
    dateTime: new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString(),
    status: "lunchIn",
    comment: comment,
  };

  const updateInfo = await userCollection.updateOne({ _id: ObjectId(employeeId) }, { $set: userUpdateInfo, $addToSet: { timeEntries: timeEntry } });
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Update failed";

  return { succeeded: true };
};

let clockOutLunch = async (employeeId, comment) => {
  await validate.checkID(employeeId);
  employeeId = employeeId.trim();
  await validate.checkString(comment);
  comment = comment.trim();
  const employeeCollection = await employees();
  const employee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (!employee) throw "Employee not found";
  if (employee.isActiveEmployee === false) throw "Employee is not active";

  let timeEntries = employee.timeEntries;

  timeEntries.sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1));

  if (timeEntries[0].status == "lunchIn") {
    throw "You have already clocked lunch for this shift.";
  }

  if (employee.currentStatus !== "clockedIn") {
    throw "Critical error: You must be clocked in to clock out for lunch!";
  }
  const userCollection = await employees();
  let userUpdateInfo = {
    currentStatus: "meal",
  };
  const timeEntry = {
    dateTime: new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString(),
    status: "lunchOut",
    comment: comment,
  };

  const updateInfo = await userCollection.updateOne({ _id: ObjectId(employeeId) }, { $set: userUpdateInfo, $addToSet: { timeEntries: timeEntry } });
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Update failed";

  return { succeeded: true };
};

// let promoteEmployee(employeeId) this function promotes an employee to manager
let promoteEmployee = async (employeeId) => {
  await validate.checkID(employeeId);
  employeeId = employeeId.trim();
  const employeeCollection = await employees();
  const employee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (!employee) throw "Employee not found";

  if (employee.isManager) throw "Employee is already a manager";
  if (employee.isActiveEmployee === false) throw "Employee is not active";

  const businessCollection = await businesses();
  const business = await businessCollection.findOne({ _id: ObjectId(employee.businessId) });
  if (!business) throw "Business not found";

  const userUpdateInfo = {
    isManager: true,
  };

  const updateInfo2 = await employeeCollection.updateOne({ _id: ObjectId(employeeId) }, { $set: userUpdateInfo });
  if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount) throw "Update failed";

  return { employeePromoted: true };
};

let demoteEmployee = async (employeeId) => {
  await validate.checkID(employeeId);
  employeeId = employeeId.trim();
  const employeeCollection = await employees();
  const employee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (!employee) throw "Employee not found";

  if (!employee.isManager) throw "Employee is not a manager";

  const businessCollection = await businesses();
  const business = await businessCollection.findOne({ _id: ObjectId(employee.businessId) });
  if (!business) throw "Business not found";

  const userUpdateInfo = {
    isManager: false,
  };

  const updateInfo2 = await employeeCollection.updateOne({ _id: ObjectId(employeeId) }, { $set: userUpdateInfo });
  if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount) throw "Update failed";

  return { employeeDemoted: true };
};

let getShifts = async (employeeId) => {
  await validate.checkID(employeeId);
  employeeId = employeeId.trim();
  const employeeCollection = await employees();
  const employee = await employeeCollection.findOne({ _id: ObjectId(employeeId) });
  if (!employee) throw "Employee not found";

  let timeEntries = employee.timeEntries;

  timeEntries.sort((a, b) => (a.dateTime > b.dateTime ? 1 : -1));

  shifts = [];
  lastClockIn = null;
  lastLunch = null;
  let lunchhours = 0;
  shiftComments = [];
  timeEntries.forEach((entry) => {
    if (lastClockIn == null) lastClockIn = entry.dateTime;
    if (entry.status == "clockIn") {
      lastClockIn = entry.dateTime;
      lunchhours = 0;
      if (entry.comment.trim() === "") {
        shiftComments = [];
      } else {
        shiftComments = [entry.comment.trim()];
      }
    } else if (entry.status == "clockOut") {
      let current = new Date(entry.dateTime);
      let prev = new Date(lastClockIn);
      let shift = {};
      if (entry.comment.trim() !== "") {
        shiftComments.push(entry.comment.trim());
      }
      if (shiftComments !== null || shiftComments !== "" || shiftComments.length !== 0) shift["comments"] = shiftComments;
      shift["date"] = current.toLocaleString().split(",")[0];
      shift["hours"] = (current - prev) / 1000 / 60 / 60 - lunchhours;
      shift["lunchHours"] = lunchhours;

      shiftMinutes = Math.floor(((shift["hours"] * 60) % 60) * 100) / 100;
      shiftHours = Math.floor(shift["hours"]);

      shift["hoursString"] = String(shiftHours).padStart(2, "0") + "h " + String(shiftMinutes.toFixed(2)).padStart(2, "0") + "m";
      shift["lunchHoursString"] = String(Math.floor(lunchhours)).padStart(2, "0") + "h " + String((lunchhours * 60).toFixed(2)).padStart(2, "0") + "m";
      shifts.push(shift);
    } else if (entry.status == "lunchIn") {
      let current = new Date(entry.dateTime);
      let prev = new Date(lastLunch.dateTime);
      lunchhours = (current - prev) / 1000 / 60 / 60;
      lastLunch = null;
      if (entry.comment.trim() !== "") {
        shiftComments.push(entry.comment.trim());
      }
    } else if (entry.status == "lunchOut") {
      lastLunch = entry;
      if (entry.comment.trim() !== "") {
        shiftComments.push(entry.comment.trim());
      }
    }
  });

  return shifts.reverse();
};

module.exports = {
  createEmployee,
  updateEmployee,
  checkEmployee,
  getAllEmployees,
  getEmployee,
  deleteEmployee,
  clockIn,
  clockOut,
  clockInLunch,
  clockOutLunch,
  promoteEmployee,
  demoteEmployee,
  getShifts,
};
