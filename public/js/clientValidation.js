//Client-side form validation for all login/signup pages
(function () {
    const loginForm = document.getElementById("login-form");
    const businessLoginForm = document.getElementById("businessLogin");
    const businessSignUpForm = document.getElementById("businessSignUp");

    //Checks validity of email 
    function checkEmail (email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(email).toLowerCase())) {
            return true;
        } else {
            return false;
        }
    }

    //Checks for input errors on "user/login" form and displays error msg to user if error detected
    if(loginForm){
        loginForm.addEventListener("submit", event => {
            event.preventDefault();

            const errorDiv = document.getElementById("errorDiv");
            errorDiv.hidden = false;

            try {
                const businessEmail = document.getElementById("businessEmail").value.trim();
                const email = document.getElementById("email").value.trim();
                const password = document.getElementById("password").value.trim();
                if (!businessEmail || !email || !password) throw new Error ("Please complete all fields");
                if (!checkEmail(businessEmail) && !checkEmail(email)) throw new Error ("Email addresses provided are invalid");
                if (!checkEmail(businessEmail)) throw new Error ("Business email address provided is invalid");
                if (!checkEmail(email)) throw new Error ("Email provided address is invalid");
                if (password.length < 8) throw new Error ("Password must be at least 8 characters");
            } catch (e) {
                let errorMsg = e.toString().slice(7);
                errorDiv.innerHTML = errorMsg;
                errorDiv.hidden = false;
            }
            
        });
    }

    //Checks for input errors on "business/login" form and displays error msg to user if error detected
    if(businessLoginForm){
        businessLoginForm.addEventListener("submit", event => {
            event.preventDefault();

            const errorDiv = document.getElementById("errorDiv");
            errorDiv.hidden = false;

            try {
                const email = document.getElementById("email").value.trim();
                const password = document.getElementById("password").value.trim();
                if (!email || !password) throw new Error ("Please complete all fields");
                if (!checkEmail(email)) throw new Error ("Email address provided is invalid");
                if (password.length < 8) throw new Error ("Password must be at least 8 characters");
            } catch (e) {
                let errorMsg = e.toString().slice(7);
                errorDiv.innerHTML = errorMsg;
                errorDiv.hidden = false;
            }
            
        });
    }

    //Checks for input errors on "business/signup" form and displays error msg to user if error detected
    if(businessSignUpForm){
        businessSignUpForm.addEventListener("submit", event => {
            event.preventDefault();

            const errorDiv = document.getElementById("errorDiv");
            errorDiv.hidden = false;

            let states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
            let zipRE = /^\d{5}$/;
            let phoneRE = /^\d{10}$/;

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
                if (!businessName || !email || !password || !confirmPassword || !address ||
                    !city || !state || !zip || !phoneNumber || !about) throw new Error ("Please complete all fields");
                if (!checkEmail(email)) throw new Error ("Email address provided is invalid");
                if (password.length < 8) throw new Error ("Password must be at least 8 characters");
                if (password != confirmPassword) throw new Error ("Passwords do not match");
                if (!states.includes(state.toUpperCase())) throw new Error ("State must be entered in 2 letter format");
                if (!zipRE.test(zip)) throw new Error ("Zip code must be entered in 5 digit format");
                if (!phoneRE.test(phone)) throw new Error ("Phone number must be entered in 10 digit format");
            } catch (e) {
                let errorMsg = e.toString().slice(7);
                errorDiv.innerHTML = errorMsg;
                errorDiv.hidden = false;
            }
            
        });
    }
})();