const mongoCollections = require("../config/mongoCollections");
const employees = mongoCollections.employees;
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const validate = require("../validate/index.js");

// function createEmployee(email, password) this function creates a email and password in monogoDB database
let createEmployee = async (email, password) => {
  await validate.checkEmail(email);
  email = email.toLowerCase().trim();
  await validate.checkPassword(password);
  password = password.trim();

  const hash = await bcrypt.hash(password, saltRounds);

  const employeesCollection = await employees();
  const newEmployee = {
    email: email,
    hashedPassword: hash,
  };
  //if email already exists in mongoDB database
  const employee = await employeesCollection.findOne({ email: email });
  if (employee) throw "employee already exists";

  const insertInfo = await employeesCollection.insertOne(newEmployee);
  if (insertInfo.insertedCount === 0)
    throw "Could not add employee to database";
  return { employeeInserted: true };
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

let getAllEmployees = async () => {
  const employeesCollection = await employees();
  const employee = await employeesCollection.find({}).toArray();
  for (const element of employee) {
    element._id = element._id.toString();
  }
  return employee;
};

module.exports = {
  createEmployee,
  checkEmployee,
  getAllEmployees,
};
