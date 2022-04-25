const mongoCollections = require("../config/mongoCollections");
const businesses = mongoCollections.businesses;
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const validate = require("../validate/index.js");

// function createBusiness(businessName, email, password, address, city, state, phone, about) this function creates a business in monogoDB database
let createBusiness = async (
  businessName,
  email,
  password,
  address,
  city,
  state,
  phone,
  about
) => {
  await validate.checkString(businessName);
  businessName = businessName.trim();
  await validate.checkEmail(email);
  email = email.toLowerCase().trim();
  await validate.checkPassword(password);
  password = password.trim();
  await validate.checkString(address);
  address = address.trim();
  await validate.checkString(city);
  city = city.trim();
  await validate.checkState(state);
  state = state.trim();
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
    phone: phone,
    about: about,
    isOpen: true,
    managers: [],
    employees: [],
  };
  //if email already exists in mongoDB database
  const businessData = await businessCollection.findOne({ email: email });
  if (businessData) throw "business already exists";

  const insertInfo = await businessCollection.insertOne(newBusiness);
  if (insertInfo.insertedCount === 0)
    throw "Could not add business to database";
  return { businessInserted: true, businessID: insertInfo.insertedId };
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
  const passwordStatus = await bcrypt.compare(
    password,
    businessData.hashedPassword
  );
  if (!passwordStatus) throw "Either the email or password is invalid";
  return { authenticated: true, businessID: businessData._id };
};

module.exports = {
  createBusiness,
  checkBusiness,
};
