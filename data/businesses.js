const mongoCollections = require("../config/mongoCollections");
const employees = mongoCollections.employees;
const businesses = mongoCollections.businesses;
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const saltRounds = 10;
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
  const passwordStatus = await bcrypt.compare(password, businessData.hashedPassword);
  if (!passwordStatus) throw "Either the email or password is invalid";

  return { authenticated: true, businessID: businessData._id, storeStatus: businessData.storeOpen, isAdmin: true };
};

let calculatePay = async (businessId) => {
  await validate.checkID(businessId);

  const employeeCollection = await employees();
  let emps = await (await employeeCollection.find({ businessId: businessId })).toArray();

  payChecks = [];
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

    totalMinutes = Math.floor(((payCheck["totalHours"] * 60) % 60) * 100) / 100;
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

    const userCollection = await employees();
    let userUpdateInfo = {
      timeEntries: [],
    };
    const updateInfo = await userCollection.updateOne({ _id: e._id }, { $addToSet: { timeEntriesOld: e.timeEntries }, $set: userUpdateInfo });
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
  businessId = businessId.toLowerCase().trim();
  const businessCollection = await businesses();
  const business = await businessCollection.findOne({ _id: ObjectId(businessId) });
  if (!business) throw "Couldn't find business";

  if (business.storeOpen) {
    const employeeCollection = await employees();
    // employees that are not "ClockedOut"
    let clockedEmployees = await employeeCollection.find({ businessId: businessId, currentStatus: { $ne: "clockedOut" } }).toArray();
    for (const employee of clockedEmployees) {
      let employee_id = employee._id.toString();
      await users.clockOut(employee_id, "Store closed");
    }
  }

  const updateInfo = await businessCollection.updateOne({ _id: ObjectId(businessId) }, { $set: { storeOpen: !business.storeOpen } }, { returnDocument: "after" });
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Update failed";

  return { storeOpen: !business.storeOpen };
};

let estimateWages = async (businessId, count) => {
  await validate.checkID(businessId);
  businessId = businessId.toLowerCase().trim();
  const businessCollection = await businesses();
  const business = await businessCollection.findOne({ _id: ObjectId(businessId) });
  if (!business) throw "Couldn't find business";

  if (business.calculations.length < count) {
    return { succeeded: false };
  }

  let totalWages = 0;
  let totalWagesWithLunch = 0;
  let employees = 0;
  let totalHours = 0;
  let totalLunchHours = 0;
  for (let i = 0; i < count; i++) {
    business.calculations[i].forEach((payCheck) => {
      totalWages += payCheck.totalPay;
      totalWagesWithLunch += payCheck.totalPayLunch;
      totalHours += payCheck.totalHours;
      totalLunchHours += payCheck.totalLunchHours;
      employees += 1;
    });
  }
  let amount = totalWages / employees;
  let amountString = amount.toFixed(2);
  let lunchAmount = totalWagesWithLunch / employees;
  let lunchAmountString = lunchAmount.toFixed(2);
  let totalHoursString = totalHours.toFixed(2);
  let totalLunchHoursString = totalLunchHours.toFixed(2);
  return {
    succeeded: true,
    count: count,
    amount: amount,
    amountString: amountString,
    lunchAmount: lunchAmount,
    lunchAmountString: lunchAmountString,
    totalHours: totalHours,
    totalHoursString: totalHoursString,
    totalLunchHours: totalLunchHours,
    totalLunchHoursString: totalLunchHoursString,
  };
};

let getActiveEmployeesData = async (businessId) => {
  await validate.checkID(businessId);

  const employeeCollection = await employees();
  let emps = await (await employeeCollection.find({ businessId: businessId })).toArray();

  totalActive = 0;
  totalInactive = 0;
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

module.exports = {
  createBusiness,
  checkBusiness,
  calculatePay,
  getPastPayPeriods,
  toggleStoreStatus,
  estimateWages,
  getActiveEmployeesData,
};
