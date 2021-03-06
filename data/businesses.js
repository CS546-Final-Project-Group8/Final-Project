const mongoCollections = require("../config/mongoCollections");
const employees = mongoCollections.employees;
const businesses = mongoCollections.businesses;
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const validate = require("../validate/index.js");
const users = require("../data/users.js");

// function createBusiness(businessName, email, password, confirmPassword address, city, state, zip, phone, about) this function creates a business in monogoDB database
let createBusiness = async (businessName, email, password, confirmPassword, address, city, state, zip, phone, about) => {
  await validate.checkString(businessName);
  businessName = businessName.trim();
  await validate.checkEmail(email);
  email = email.toLowerCase().trim();
  await validate.checkPassword(password);
  password = password.trim();
  await validate.checkPassword(confirmPassword);
  confirmPassword = confirmPassword.trim();
  if (password !== confirmPassword) throw "Passwords do not match";
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
  await validate.checkString(about);
  about = about.trim();
  const hash = await bcrypt.hash(password, saltRounds);

  const businessCollection = await businesses();
  const newBusiness = {
    businessName: businessName,
    email: email,
    hashedPassword: hash,
    address: address,
    city: city,
    state: state,
    zip: zip,
    phone: phone,
    about: about,
    timeOff: [],
    storeOpen: true,
    calculations: [],
  };
  //if email already exists in mongoDB database
  const businessData = await businessCollection.findOne({ email: email });
  if (businessData) throw "business already exists";

  const insertInfo = await businessCollection.insertOne(newBusiness);
  if (insertInfo.insertedCount === 0) throw "Could not add business to database";
  // convert the ObjectId to string
  const newId = insertInfo.insertedId.toString();
  return { businessInserted: true, businessID: newId };
};

// function checkBusiness(email, password) this function checks if the email and password are correct
let checkBusiness = async (email, password) => {
  await validate.checkEmail(email);
  email = email.toLowerCase().trim();
  await validate.checkPassword(password);
  password = password.trim();

  const businessCollection = await businesses();
  const businessData = await businessCollection.findOne({ email: email });
  if (!businessData) throw "Either the email or password is invalid";
  let businessId = businessData._id.toString();
  const passwordStatus = await bcrypt.compare(password, businessData.hashedPassword);
  if (!passwordStatus) throw "Either the email or password is invalid";

  return { authenticated: true, businessID: businessId, storeStatus: businessData.storeOpen, isAdmin: true };
};

let calculatePay = async (businessId) => {
  await validate.checkID(businessId);

  const employeeCollection = await employees();
  let emps = await (await employeeCollection.find({ businessId: businessId })).toArray();

  let payChecks = [];
  for (const e of emps) {
    let shifts = await users.getShifts(e._id.toString());
    if (shifts.length === 0) continue;

    let totalHours = 0;
    let totalLunchHours = 0;
    let allComments = [];

    shifts.forEach((shift) => {
      totalHours += shift.hours;
      totalLunchHours += shift.lunchHours;
      if (shift.comments.length !== 0) {
        allComments.push(shift.comments.flat());
      }
    });

    let payCheck = {};
    payCheck["employeeName"] = e.firstName + " " + e.lastName;
    payCheck["allComments"] = allComments;
    payCheck["totalHours"] = totalHours;

    let totalMinutes = Math.floor(((payCheck["totalHours"] * 60) % 60) * 100) / 100;
    totalHours = Math.floor(payCheck["totalHours"]);

    payCheck["totalHoursString"] = String(totalHours).padStart(2, "0") + "h " + String(totalMinutes.toFixed(2)).padStart(2, "0") + "m";
    payCheck["totalLunchHours"] = totalLunchHours;
    payCheck["totalLunchHoursString"] = String(Math.floor(totalLunchHours)).padStart(2, "0") + "h " + String((totalLunchHours * 60).toFixed(2)).padStart(2, "0") + "m";

    payCheck["totalPay"] = payCheck["totalHours"] * e.hourlyPay;
    payCheck["totalPayString"] = "$" + payCheck["totalPay"].toFixed(2);
    payCheck["totalPayLunch"] = (payCheck["totalHours"] + payCheck["totalLunchHours"]) * e.hourlyPay;
    payCheck["totalPayLunchString"] = "$" + payCheck["totalPayLunch"].toFixed(2);
    payCheck["date"] = new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString();

    payChecks.push(payCheck);

    let timeEntries = e.timeEntries.sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1));
    let i;
    for (i = 0; i < timeEntries.length; i++) if (timeEntries[i].status === "clockOut") break;
    timeEntries = timeEntries.slice(0, i);
    let timeEntriesOld = timeEntries.slice(i, timeEntries.length);

    const userCollection = await employees();
    let userUpdateInfo = {
      timeEntries: timeEntries,
    };
    const updateInfo = await userCollection.updateOne({ _id: e._id }, { $addToSet: { timeEntriesOld: timeEntriesOld }, $set: userUpdateInfo });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Update failed";
  }

  if (payChecks.length !== 0) {
    const businessCollection = await businesses();
    const updateInfo = await businessCollection.updateOne({ _id: ObjectId(businessId) }, { $addToSet: { calculations: payChecks } });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Update failed";
  }

  return payChecks;
};

let getPastPayPeriods = async (businessId) => {
  await validate.checkID(businessId);
  const businessCollection = await businesses();
  const business = await businessCollection.findOne({ _id: ObjectId(businessId) });
  if (!business) throw "Couldn't find business";

  if (business.calculations != undefined && business.calculations.length > 0) {
    return business.calculations.reverse();
  } else {
    return business.calculations;
  }
};

let toggleStoreStatus = async (businessId) => {
  await validate.checkID(businessId);
  businessId = businessId.trim();
  const businessCollection = await businesses();
  const business = await businessCollection.findOne({ _id: ObjectId(businessId) });
  if (!business) throw "Couldn't find business";

  if (business.storeOpen) {
    const employeeCollection = await employees();
    // employees that are not "ClockedOut"
    let clockedEmployees = await employeeCollection.find({ businessId: businessId, currentStatus: { $ne: "clockedOut" } }).toArray();
    for (const employee of clockedEmployees) {
      let employee_id = employee._id.toString();
      if (employee.currentStatus === "clockedIn") {
        await users.clockOut(employee_id, "Store closed");
      } else {
        await users.clockInLunch(employee_id, "");
        await users.clockOut(employee_id, "Store closed");
      }
    }
  }

  const updateInfo = await businessCollection.updateOne({ _id: ObjectId(businessId) }, { $set: { storeOpen: !business.storeOpen } }, { returnDocument: "after" });
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Update failed";

  return { storeOpen: !business.storeOpen };
};

// function getBusiness get gets business given a businessId and returns its attributes
let getBusiness = async (businessId) => {
  await validate.checkID(businessId);
  businessId = businessId.trim();

  const businessCollection = await businesses();
  const businessData = await businessCollection.findOne({ _id: ObjectId(businessId) });
  if (!businessData) throw "Business ID given was invalid";
  delete businessData.hashedPassword;
  delete businessData.calculations;

  return businessData;
};

//function updateBusinessInfo updates the business key values in database
let updateBusinessInfo = async (businessId, businessName, email, address, city, state, zip, phone, about) => {
  await validate.checkID(businessId);
  businessId = businessId.trim();
  await validate.checkString(businessName);
  businessName = businessName.trim();
  await validate.checkEmail(email);
  email = email.toLowerCase().trim();
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
  await validate.checkString(about);
  about = about.trim();
  const businessCollection = await businesses();

  // make sure that the email is unique
  const businessDataCheck = await businessCollection.findOne({ email: email });
  if (businessDataCheck && businessDataCheck._id.toString() !== businessId) throw "Email already exists";

  let updateInfo = {
    businessName: businessName,
    email: email,
    address: address,
    city: city,
    state: state,
    zip: zip,
    phone: phone,
    about: about,
  };
  const businessData = await businessCollection.updateOne({ _id: ObjectId(businessId) }, { $set: updateInfo });
  if (!businessData) throw "Business could not be found in location";
  return true;
};

let estimateWages = async (businessId) => {
  await validate.checkID(businessId);
  businessId = businessId.trim();
  const employeeCollection = await employees();
  let emps = await (await employeeCollection.find({ businessId: businessId })).toArray();

  let totalHours = 0;
  let totalLunchHours = 0;
  let totalPay = 0;
  let totalPayLunch = 0;
  for (const employee of emps) {
    let shifts = await users.getShifts(employee._id.toString());
    for (const element of shifts) {
      totalHours += element.hours;
      totalLunchHours += element.lunchHours;
      totalPay += element.hours * employee.hourlyPay;
      totalPayLunch += (element.hours + element.lunchHours) * employee.hourlyPay;
    }
  }

  let totalMinutes = Math.floor(((totalHours * 60) % 60) * 100) / 100;
  let totalHoursString = totalHours.toFixed(0).padStart(2, "0") + "h " + String(totalMinutes.toFixed(2)).padStart(2, "0") + "m";
  let totalLunchHoursString = String(Math.floor(totalLunchHours)).padStart(2, "0") + "h " + String((totalLunchHours * 60).toFixed(2)).padStart(2, "0") + "m";

  return {
    succeeded: true,
    totalHours: totalHours,
    totalHoursString: totalHoursString,
    totalLunchHours: totalLunchHours,
    totalLunchHoursString: totalLunchHoursString,
    totalPay: totalPay,
    totalPayLunch: totalPayLunch,
  };
};

let getActiveEmployeesData = async (businessId) => {
  await validate.checkID(businessId);
  businessId = businessId.trim();

  const employeeCollection = await employees();
  let emps = await (await employeeCollection.find({ businessId: businessId })).toArray();

  let totalActive = 0;
  let totalInactive = 0;
  emps.forEach((employee) => {
    if (employee.isActiveEmployee) {
      totalActive += 1;
    } else {
      totalInactive += 1;
    }
  });
  if (totalActive + totalInactive == 0) return null;
  return [
    ["Status", "Employees"],
    ["Active", totalActive],
    ["Inactive", totalInactive],
  ];
};

let getEmployeeStatusData = async (businessId) => {
  await validate.checkID(businessId);
  businessId = businessId.trim();

  const employeeCollection = await employees();
  let emps = await (await employeeCollection.find({ businessId: businessId })).toArray();

  let totalClockedIn = emps.filter((obj) => obj.currentStatus === "clockedIn").length;
  let totalClockedOut = emps.filter((obj) => obj.currentStatus === "clockedOut").length;
  let totalMeal = emps.filter((obj) => obj.currentStatus === "meal").length;
  //if (totalClockedIn + totalClockedOut + totalMeal == 0) return null;
  return [
    ["Status", "Employees"],
    ["Clocked Out", totalClockedOut],
    ["Clocked In", totalClockedIn],
    ["Meal", totalMeal],
  ];
};

// get store status for a business
let getStoreStatus = async (businessId) => {
  await validate.checkID(businessId);
  businessId = businessId.trim();
  const businessCollection = await businesses();
  const business = await businessCollection.findOne({ _id: ObjectId(businessId) });
  if (!business) throw "Couldn't find business";

  return business.storeOpen;
};

module.exports = {
  createBusiness,
  checkBusiness,
  calculatePay,
  getPastPayPeriods,
  toggleStoreStatus,
  getBusiness,
  updateBusinessInfo,
  estimateWages,
  getActiveEmployeesData,
  getEmployeeStatusData,
  getStoreStatus,
};
