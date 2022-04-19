const mongoCollections = require("../config/mongoCollections");
const employees = mongoCollections.employees;
const businesses = mongoCollections.businesses;
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const validate = require("../validate/index.js");

// function createEmployee(businessId, email, password, firstName, lastName, gender,  address, city, state, phone, hourlyPay, startDate, isManager) this function creates an employee in monogoDB database
let createEmployee = async (
  businessId,
  email,
  password,
  firstName,
  lastName,
  gender,
  address,
  city,
  state,
  phone,
  hourlyPay,
  startDate,
  isManager
) => {
  await validate.checkID(businessId);
  await validate.checkEmail(email);
  email = email.toLowerCase().trim();
  await validate.checkPassword(password);
  password = password.trim();
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
  await validate.checkPhone(phone);
  phone = phone.trim();
  await validate.checkNumber(hourlyPay);
  hourlyPay = parseInt(hourlyPay);
  // await validate.checkDate(startDate);  // pending
  startDate = startDate.trim();
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
    state: state,
    phone: phone,
    hourlyPay: hourlyPay,
    startDate: startDate,
    isManager: isManager,
  };

  //if email already exists in mongoDB database
  const employee = await employeesCollection.findOne({ email: email });
  if (employee) throw "employee already exists";

  const insertInfo = await employeesCollection.insertOne(newEmployee);
  console.log(insertInfo);
  if (insertInfo.insertedCount === 0)
    throw "Could not add employee to database";

  // add employeeID to business collection
  const newEmployeeId = insertInfo.insertedId.toString();
  const updateInfo = await businessCollection.updateOne(
    { _id: ObjectId(businessId) },
    { $push: { employees: newEmployeeId } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "Could not add employee to business";
  }

  return { employeeInserted: true, employeeID: insertInfo.insertedId };
};

// function checkEmployee(email, password) this function checks if the email and password are correct
let checkEmployee = async (email, password) => {
  await validate.checkEmail(email);
  email = email.toLowerCase().trim();
  await validate.checkPassword(password);
  password = password.trim();

  const employeesCollection = await employees();
  const employee = await employeesCollection.findOne({ email: email });
  if (!employee) throw "Either the email or password is invalid";
  const passwordStatus = await bcrypt.compare(
    password,
    employee.hashedPassword
  );
  if (!passwordStatus) throw "Either the email or password is invalid";
  return { authenticated: true };
};

let getAllEmployees = async (businessId) => {
  validate.checkID(businessId);
  const employeesCollection = await employees();
  const Allemployees = await employeesCollection
    .find({
      businessId: businessId,
    })
    .toArray();
  for (const employee of Allemployees) {
    employee._id = employee._id.toString();
  }
  return Allemployees;
};

module.exports = {
  createEmployee,
  checkEmployee,
  getAllEmployees,
};
