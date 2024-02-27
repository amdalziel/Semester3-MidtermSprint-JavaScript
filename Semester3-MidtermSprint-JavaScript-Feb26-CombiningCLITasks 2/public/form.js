
window.addEventListener("DOMContentLoaded", function () {

    document.getElementById("brewery-form").addEventListener("submit", function(event) {

        event.preventDefault();

        if (validateInput() && validatePhone() && validateEmail()) {
            this.submit();
        }
    
    }); 

}); 

   

    function validateInput() {

        let userInput = document.getElementById("username").value;
        let emailInput = document.getElementById("email").value;
        let phoneInput = document. getElementById("phone").value; 
    
        let userMess = document.getElementById("user-message"); 

        userMess.innerHTML = "";

        if (userInput == "" || emailInput == "" || phoneInput == "") {

            let errMess = document.createElement("p"); 
            errMess.innerText = "Error: please fill in all three fields"; 
            userMess.appendChild(errMess); 

            return false;  
        } else {
            return true; 
        }
    }

    function validateEmail() {

  
        let emailInput = document.getElementById("email").value;
    
        let userMess = document.getElementById("user-message"); 

        userMess.innerHTML = "";

        let emailRe = /^.+@[a-z]+\.[a-z]+$/i; 
        let verifyEmail = emailRe.test(emailInput); 
        console.log("validate email"); 

        if (!verifyEmail) {

            let errMess = document.createElement("p"); 
            errMess.innerText = "Error: please enter a valid email."; 
            userMess.appendChild(errMess); 

            return false;  
        } else {
            return true; 
        }
    }

    function validatePhone() {

    
        let phoneInput = document. getElementById("phone").value; 
    
        let userMess = document.getElementById("user-message"); 

        userMess.innerHTML = "";

        let phoneRe = /^\d{3}-\d{3}-\d{4}$/i; 
        let verifyPhone = phoneRe.test(phoneInput); 
        console.log("validate phone"); 

        if (!verifyPhone) {

            let errMess = document.createElement("p"); 
            errMess.innerText = "Error: please enter a valid phone number."; 
            userMess.appendChild(errMess); 

            return false;  
        } else {
            return true; 
        }
    }