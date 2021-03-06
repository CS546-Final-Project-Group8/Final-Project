//Instantiates JS variables to corresponding DOM element with matching id
const loginForm = document.getElementById("login-form");
const businessLoginForm = document.getElementById("businessLogin");
const businessSignUpForm = document.getElementById("businessSignUp");
const timeOffForm = document.getElementById("timeOffForm");

//Checks validity of email
function checkEmailInHome(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !!re.test(String(email).toLowerCase());
}

//Error checking for all login form inputs, throws error if an input is invalid
function loginFormErrorCheck(businessEmail, email, password) {
  if (!businessEmail || !email || !password) throw "Please complete all fields";
  if (!checkEmailInHome(businessEmail) && !checkEmailInHome(email)) throw "Email addresses provided are invalid";
  if (!checkEmailInHome(businessEmail)) throw "Business email address provided is invalid";
  if (!checkEmailInHome(email)) throw "Email provided address is invalid";
  if (password.length < 8) throw "Password must be at least 8 characters";
}

//Error checking for all business login form inputs, throws error if an input is invalid
function businessLoginFormErrorCheck(email, password) {
  if (!email || !password) throw "Please complete all fields";
  if (!checkEmailInHome(email)) throw "Email address provided is invalid";
  if (password.length < 8) throw "Password must be at least 8 characters";
}

//Error checking for all business signup form inputs, throws error if an input is invalid
function businessSignUpFormErrorCheck(businessName, email, password, confirmPassword, address, city, state, zip, phoneNumber, about) {
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
  let zipRE = /^\d{5}$/;
  let phoneRE = /^\d{10}$/;
  if (!businessName || !email || !password || !confirmPassword || !address || !city || !state || !zip || !phoneNumber || !about) throw "Please complete all fields";
  if (!checkEmailInHome(email)) throw "Email address provided is invalid";
  if (password.length < 8) throw "Password must be at least 8 characters";
  if (password != confirmPassword) throw "Passwords do not match";
  if (!states.includes(state.toUpperCase())) throw "State must be entered in 2 letter format";
  if (!zipRE.test(zip)) throw "Zip code must be entered in 5 digit format";
  if (!phoneRE.test(phoneNumber)) throw "Phone number must be entered in 10 digit format";
}

//Error checking for "Request Time Off" form
function timeOffFormErrorCheck(date1, date2) {
  if (!date1 || !date2) throw "Please complete all fields";
  if (date1 > date2) throw "Start date must be before end date";
  let today = new Date().toISOString().split("T")[0];
  if (date1 < today || date2 < today) throw "Inputs must be current date or future dates";
}

//Checks for input errors on "user/login" form and displays error msg to user if error detected
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = document.querySelector(".error");
    if (error) error.innerHTML = "";
    const errorDiv = document.getElementById("errorDiv");
    errorDiv.hidden = true;

    try {
      const businessEmail = document.getElementById("businessEmail").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      loginFormErrorCheck(businessEmail, email, password);

      loginForm.submit();
    } catch (e) {
      event.preventDefault();
      errorDiv.innerHTML = e;
      errorDiv.hidden = false;
      errorDiv.style.color = "red";
    }
  });
}

//Checks for input errors on "business/login" form and displays error msg to user if error detected
if (businessLoginForm) {
  businessLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = document.querySelector(".error");
    if (error) error.innerHTML = "";
    const errorDiv = document.getElementById("errorDiv");
    errorDiv.hidden = true;

    try {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      businessLoginFormErrorCheck(email, password);

      businessLoginForm.submit();
    } catch (e) {
      event.preventDefault();
      errorDiv.innerHTML = e;
      errorDiv.hidden = false;
      errorDiv.style.color = "red";
    }
  });
}

//Checks for input errors on "business/signup" form and displays error msg to user if error detected
if (businessSignUpForm) {
  businessSignUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = document.querySelector(".error");
    if (error) error.innerHTML = "";
    const errorDiv = document.getElementById("errorDiv");
    errorDiv.hidden = true;

    try {
      const businessName = document.getElementById("businessName").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
      const address = document.getElementById("address").value.trim();
      const city = document.getElementById("city").value.trim();
      const state = document.getElementById("state").value.trim();
      const zip = document.getElementById("zip").value.trim();
      const phoneNumber = document.getElementById("phoneNumber").value.trim();
      const about = document.getElementById("about").value.trim();
      businessSignUpFormErrorCheck(businessName, email, password, confirmPassword, address, city, state, zip, phoneNumber, about);

      businessSignUpForm.submit();
    } catch (e) {
      event.preventDefault();
      errorDiv.innerHTML = e;
      errorDiv.hidden = false;
      errorDiv.style.color = "red";
    }
  });
}

//Checks for input errors on "Request Time Off" Form
if (timeOffForm) {
  timeOffForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const errorMsg = document.getElementById("timeOffErrorMsg");
    const timeOffModal = document.getElementById("timeOffModal");
    errorMsg.hidden = true;

    try {
      const startDate = document.getElementById("timeOffStartDate").value;
      const endDate = document.getElementById("timeOffEndDate").value;
      timeOffFormErrorCheck(startDate, endDate);
      timeOffModal.style.display = "none";

      timeOffForm.submit();
    } catch (e) {
      event.preventDefault();
      errorMsg.innerHTML = e;
      errorMsg.hidden = false;
    }
  });
}

let checkCommentString = async (comment) => {
  if (typeof comment !== "string") throw "Comment must be a string";
};

const clockInForm = document.getElementById("clockInForm");
if (clockInForm) {
  clockInForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      $(".clientError").innerHTML = "";
      $(".clientError").attr("hidden", true);
      const comment = $("#comment").val();
      await checkCommentString(comment);
      clockInForm.submit();
    } catch (e) {
      $(".clientError").innerHTML = e;
      $(".clientError").attr("hidden", false);
    }
  });
}

const clockOutForm = document.getElementById("clockOutForm");
if (clockOutForm) {
  clockOutForm.addEventListener("submit", async (event) => {
    try {
      $(".clientError").innerHTML = "";
      $(".clientError").attr("hidden", true);
      const comment = $("#comment").val();
      await checkCommentString(comment);
      // clockOutForm.submit();
    } catch (e) {
      $(".clientError").innerHTML = e;
      $(".clientError").attr("hidden", false);
    }
  });
}

const mealBreakForm = document.getElementById("mealBreakForm");
if (mealBreakForm) {
  mealBreakForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      $(".clientError").innerHTML = "";
      $(".clientError").attr("hidden", true);
      const comment = $("#comment").val();
      await checkCommentString(comment);
      mealBreakForm.submit();
    } catch (e) {
      $(".clientError").innerHTML = e;
      $(".clientError").attr("hidden", false);
    }
  });
}
