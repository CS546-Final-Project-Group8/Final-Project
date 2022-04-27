(function () {
    const loginForm = document.getElementById("login-form");

    if(loginForm){
        loginForm.addEventListener("submit", event => {
            event.preventDefault();

            const ul = document.getElementById("attempts");
            const errorDiv = document.getElementById("error");
            if (errorDiv.hidden == false) errorDiv.hidden = true;
            try {
                const number = document.getElementById("number");
                const numberValue = number.value;
                const parsedNumberValue = parseInt(numberValue);
                if (parsedNumberValue < 3) throw new Error (parsedNumberValue + " is invalid! The input must be greater than 2! Please resubmit with a different input.");
                if (Number.isNaN(parsedNumberValue)) throw new Error ("The input cannot be empty! Please resubmit with a different input.");
                result = isPrime(parsedNumberValue);
                if(result){
                    let li = document.createElement("li");
                    li.innerHTML = parsedNumberValue + " is a prime number";
                    li.className = "is-prime";
                    ul.appendChild(li);
                }
                else {
                    let li = document.createElement("li");
                    li.innerHTML = parsedNumberValue + " is NOT a prime number";
                    li.className = "not-prime";
                    ul.appendChild(li);
                }
            } catch (e) {
                errorDiv.innerHTML = e;
                errorDiv.hidden = false;
            }
        });
    }
})();