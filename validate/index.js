const { ObjectId } = require("mongodb");

// function checkString(string) this function checks if the string is valid
let checkString = async (str) => {
  return !(!str || typeof str !== "string" || !str.trim());
};

// function checkNumber(number) this function checks if the number is a valid positive number
let checkNumber = async (num) => {
  if (!num) {
    throw "Error: Invalid number, please enter a number";
  }
  if (typeof num === "string") {
    if (num != parseInt(num)) {
      // here "==" is the logic used to compare data but not the type
      throw "Error: Invalid number, please enter a number";
    }
  }
  num = parseInt(num);
  if (isNaN(num)) {
    throw "Error: Invalid number, please enter a number";
  }
  if (num < 0) {
    throw "Error: Invalid number, please enter a positive number";
  }
  return true;
};

// function checkBoolean(boolean) this function checks if the boolean is valid
let checkBoolean = async (bool) => {
  if (!bool) {
    throw "Error: Invalid boolean, please enter a boolean";
  }
  if (typeof bool === "string") {
    if (bool.toLowerCase() === "true" || bool.toLowerCase() === "false") {
      return true;
    } else {
      throw "Error: Invalid boolean, please enter a boolean";
    }
  }
  if (typeof bool === "boolean") {
    return true;
  } else {
    throw "Error: Invalid boolean, please enter a boolean";
  }
};

// function checkDate(date) this function checks if the date is valid

let checkDate = async (date) => {
  await checkString(date);
  date = date.trim();
  // validate Date in YYYY-MM-DD format
  let arr = date.split("-");
  if (arr.length !== 3) throw "Error: Date should contain 3 values of month, day, year in YYYY-MM-DD format";

  let year = parseInt(arr[0]);
  let month = parseInt(arr[1]);
  let day = parseInt(arr[2]);

  if (year != arr[0] || month != arr[1] || day != arr[2]) {
    throw "Error: Invalid characters present in releaseDate";
  }

  if (month > 12 || month < 1) throw "Error: month of Date should be between 1 and 12";
  // months with 31 days
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
    if (day < 1 || day > 31) {
      throw "Error: Value for day should be between 1 and 31";
    }
  } // months with 30 days
  else if ([4, 6, 9, 11].includes(month)) {
    if (day < 1 || day > 30) {
      throw "Error: Value for day should be between 1 and 30";
    }
  } // february
  else if (month === 2) {
    if (year % 4 === 0) {
      if (day < 1 || day > 29) {
        throw "Error: Value for day should be between 1 and 29";
      }
    } else {
      if (day < 1 || day > 28) {
        throw "Error: Value for day should be between 1 and 28";
      }
    }
  }
  // check if date is in the past, if not throw error
  // new Date() returns the current date in YYYY-MM-DD format

  let currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    throw "Error: Value for year should be between 1900 and " + currentYear;
  } else if (year === currentYear) {
    let currentMonth = new Date().getMonth() + 1;
    if (month > currentMonth) {
      throw "Error: Value for month should be less than or equal to " + currentMonth;
    } else if (month === currentMonth) {
      let currentDay = new Date().getDate();
      if (day > currentDay) {
        throw "Error: Value for day should be less than or equal to " + currentDay;
      }
    }
  }
  return true;
};

// function cheackEmail(email) this function checks if the email is valid
let checkEmail = async (email) => {
  await checkString(email);
  email = email.trim();
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) {
    throw "Invalid, Enter a proper email";
  } else {
    return true;
  }
};

// function checkPassword(password) this function checks if the password is valid
let checkPassword = async (password) => {
  await checkString(password);
  password = password.trim();
  if (password.length < 8) throw "Error: Password should be at least 8 characters long";
};

// function checkState(state) this function checks if the state is valid
let checkState = async (state) => {
  await checkString(state);
  state = state.trim();
  let states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];
  if (!states.includes(state.toUpperCase())) {
    throw "Error: Invalid state, please enter state in 2 letter format";
  }
};

// function checkZip(zip) this function checks if the zip is valid
let checkZip = async (zip) => {
  await checkString(zip);
  zip = zip.trim();
  let re = /^\d{5}$/;
  if (!re.test(zip)) {
    throw "Error: Invalid zip code, please enter zip code in 5 digit format";
  } else {
    return true;
  }
};

// function checkPhone(phone) this function checks if the phone is valid
let checkPhone = async (phone) => {
  await checkString(phone);
  phone = phone.trim();
  let re = /^\d{10}$/;
  if (!re.test(phone)) {
    throw "Error: Invalid phone number, please enter phone number in 10 digit format";
  } else {
    return true;
  }
};

// checkID(ObjectID) this function checks if the ObjectID is valid mongoDB ObjectID
let checkID = async (id) => {
  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    throw "Error: Invalid ObjectID, please enter ObjectID in string format";
  }
  return true;
};

// let checkGender(gender), check if gender is valid
let checkGender = async (gender) => {
  if (["male", "female", "transgender", "gender neutral", "non-binary", "prefer not to say"].includes(gender.toLowerCase().trim())) {
    return true;
  } else {
    throw "Please choose a gender from provided options";
  }
};

let checkEmploymentStatus = async (employmentStatus) => {
  if (["full-time", "part-time", "contract", "intern", "temporary", "volunteer", "other"].includes(employmentStatus.toLowerCase().trim())) {
    return true;
  } else {
    throw "Please choose an employment status from provided options";
  }
};

module.exports = {
  checkString,
  checkNumber,
  checkBoolean,
  checkDate,
  checkEmail,
  checkPassword,
  checkState,
  checkZip,
  checkPhone,
  checkID,
  checkGender,
  checkEmploymentStatus,
};
