// function checkString(string) this function checks if the string is valid
let checkString = async (str) => {
  return !(!str || typeof str !== "string" || !str.trim());
};

// function checkNumber(number) this function checks if the number is a valid positive number
let checkNumber = async (num) => {
  if (!num || typeof num !== "number" || !Number.isInteger(age) || num < 0) {
    throw "Invalid number, please enter a valid positive number";
  } else {
    return true;
  }
};

// function checkBoolean(boolean) this function checks if the boolean is valid
let checkBoolean = async (bool) => {
  if (!bool || typeof bool !== "boolean") {
    throw "Error: Invalid boolean, please enter boolean in true or false format";
  } else {
    return true;
  }
};

// function checkDate(date) this function checks if the date is valid
let checkDate = async (date) => {
  await checkString(date);
  // validate Date in MM/DD/YYYY format
  let arr = date.split("/");
  if (arr.length !== 3)
    throw "Error: Date should contain 3 values of month, day, year in MM/DD/YYYY format";
  if (arr[0] > 12 || arr[0] < 1)
    throw "Error: month of Date should be between 1 and 12";

  let month = parseInt(arr[0]);
  let day = parseInt(arr[1]);
  let year = parseInt(arr[2]);
  if (month != arr[0] || day != arr[1] || year != arr[2]) {
    throw "Error: Invalid characters present in releaseDate";
  }
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
  else if (month == 2) {
    if (year % 4 == 0) {
      if (day < 1 || day > 29) {
        throw "Error: Value for day should be between 1 and 29";
      }
    } else {
      if (day < 1 || day > 28) {
        throw "Error: Value for day should be between 1 and 28";
      }
    }
    if (year < 1900 || year > 2023) {
      throw "Error: Value for year should be between 1900 and 2023";
    }
  }
};

// function cheackEmail(email) this function checks if the email is valid
let checkEmail = async (email) => {
  await checkString(email);
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) {
    throw "Invalid, Enter a proper email";
  } else {
    return true;
  }
};

// function checkPassword(password) this function checks if the password is valid
let checkPassword = async (password) => {
  await checkString(password);
  if (password.length < 8)
    throw "Error: Password should be at least 8 characters long";
};

// function checkState(state) this function checks if the state is valid
let checkState = async (state) => {
  await checkString(state);
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
  if (!states.includes(state)) {
    throw "Error: Invalid state, please enter state in 2 letter format";
  }
};

// function checkZip(zip) this function checks if the zip is valid
let checkZip = async (zip) => {
  await checkString(zip);
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
  let re = /^\d{10}$/;
  if (!re.test(phone)) {
    throw "Error: Invalid phone number, please enter phone number in 10 digit format";
  } else {
    return true;
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
};
