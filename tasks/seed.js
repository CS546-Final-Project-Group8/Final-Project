const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const employees = data.employees;
const businesses = data.businesses;

let main = async () => {
  try {
    let db = await dbConnection.connectToDb();
    await db.dropDatabase();
    let business1 = await businesses.createBusiness(
      "Starbucks",
      "starbucks@gmail.com",
      "Starbucks",
      "123 Main St",
      "Los Angeles",
      "CA",
      "1234567890",
      "We sell coffee"
    );
    let business2 = await businesses.createBusiness(
      "McDonalds",
      "McDonalds@gmail.com",
      "McDonalds",
      "124 Bleecker St",
      "New York",
      "NY",
      "5555555555",
      "We sell burgers"
    );
    let business3 = await businesses.createBusiness(
      "Pizza Hut",
      "pizzahut@gmail.com",
      "PizzaHut",
      "125 Broadway",
      "New York",
      "NY",
      "8888888888",
      "We sell pizza"
    );
    let starbuctsEmployee1 = await employees.createEmployee(
      business1.businessID, //businessID
      "staremp1@gmail.com", //email
      "staremp1", //password
      "John", //firstName
      "Doe", //lastName
      "male", //gender
      "245 Main St", //address
      "Los Angeles", //city
      "CA", //state
      "6432587410", //phone
      "Full-time", //employment type
      "true", //employment status
      "55", // hourly pay rate
      new Date().toISOString().slice(0, 10), //start date
      "true" // is manager
    );

    let starbuctsEmployee2 = await employees.createEmployee(
      business1.businessID, //businessID
      "staremp2@gmail.com", //email
      "staremp2", //password
      "Jane", //firstName
      "Doe", //lastName
      "female", // gender
      "245 Main St", // address
      "Los Angeles", // city
      "CA", // state
      "6432587411", // phone
      "part-time", // employment type
      "true", // employement status
      "55", // hourly pay rate
      new Date().toISOString().slice(0, 10), // start date
      "false" // is manager
    );

    let starbuctsEmployee3 = await employees.createEmployee(
      business1.businessID, //businessID
      "staremp3@gmail.com", //email
      "staremp3", //password
      "Alex", //firstName
      "Smith", //lastName
      "transgender", //gender
      "246 Main St", // address
      "Los Angeles", // city
      "CA", // state
      "6432587412", // phone
      "Contract", // employment type
      "true", // employement status
      "35", // hourly pay rate
      new Date().toISOString().slice(0, 10), // start date
      "false" // is manager
    );

    let McDonaldsEmployee1 = await employees.createEmployee(
      business2.businessID, //businessID
      "macdemp1@gmail.com", //email
      "macdemp1", //password
      "Pete", //firstName
      "Cook", //lastName
      "male", // gender
      "125 Bleecker St", //address
      "New York", //city
      "NY", //state
      "5555555001", //phone
      "full-time", // employment type
      "true", // employement status
      "45", // hourly pay rate
      new Date().toISOString().slice(0, 10), // start date
      "true" // is manager
    );

    let McDonaldsEmployee2 = await employees.createEmployee(
      business2.businessID, //businessID
      "macdemp2@gmail.com", //email
      "macdemp2", //password
      "John", //firstName
      "Smith", //lastName
      "male", // gender
      "125 Bleecker St", //address
      "New York", //city
      "NY", //state
      "5555555001", //phone
      "full-time", // employment type
      "true", // employement status
      "45", // hourly pay rate
      new Date().toISOString().slice(0, 10), // start date
      "false" // is manager
    );

    dbConnection.closeConnection();
  } catch (e) {
    console.log(e);
  }
};

main();
