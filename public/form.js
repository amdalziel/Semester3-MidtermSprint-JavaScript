
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

        if (userInput == "" || emailInput == "" || phoneInput == "") {
            userMess.innerText = "Error: please fill in all three fields"; 
            return false;  
        } else {
            return true; 
        }
    }

    function validateEmail() {

  
        let emailInput = document.getElementById("email").value;
    
        let userMess = document.getElementById("user-message"); 

        let emailRe = /^.+@[a-z]+\.[a-z]+$/i; 
        let verifyEmail = emailRe.test(emailInput); 
        console.log("validate email"); 

        if (!verifyEmail) {
            userMess.innerText = "Error: please enter a valid email."; 
            return false;  
        } else {
            return true; 
        }
    }

    function validatePhone() {

    
        let phoneInput = document. getElementById("phone").value; 
    
        let userMess = document.getElementById("user-message"); 

        let phoneRe = /^\d{3}-\d{3}-\d{4}$/i; 
        let verifyPhone = phoneRe.test(phoneInput); 
        console.log("validate phone"); 

        if (!verifyPhone) {
            userMess.innerText = "Error: please enter a valid phone number."; 
            return false;  
        } else {
            return true; 
        }
    }