
window.addEventListener("DOMContentLoaded", function () {

    let submitBtn = document.getElementById("submit-btn");
    

    submitBtn.addEventListener("click", function(e) { 
        e.preventDefault(); 
        let userName = document.getElementById("username"); 
        let email = document.getElementById("email"); 
        let phone = document.getElementById("phone"); 

        let userValue = document.getElementById("username").value;
        let emailValue = document.getElementById("email").value; 
        let phoneValue = document.getElementById("phone").value; 
        // console.log('click'); 
        // console.log(userValue); 
        // console.log(emailValue);
        // console.log(phoneValue); 

        newWebToken(userValue, emailValue, phoneValue); 
        clearFields(userName, email, phone); 
   
    }); 


    async function newWebToken(userName, email, phone) {
            console.log('token.newToken()');
            let newToken = JSON.parse(`{
                "created": "2000-01-01 12:30:00",
                "username": "username",
                "email": "user@email.com",
                "phone": "2223334444",
                "token": "token",
                "expires": "2000-01-04 12:30:00",
                "confirmed": "tbd"
            }`);
          
            let now = new Date();
            let expires = addDays(now, 3);
          
            newToken.created = now; // change format
            newToken.username = userName;
            newToken.email = email; 
            newToken.phone = phone; 
            newToken.token = `token number goes here`; 
            newToken.expires = expires; //change format 
          
            console.log(newToken); 

            try {
                const response = await fetch('/api/storeToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newToken)
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log('Token stored successfully:', result);
            
            } catch (error) {
                console.error('Error storing token:', error);
       
            } 

            return newToken;
        
    }

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }

      function clearFields(u, e, p) 
      {
        console.log('clearFields()'); 
        let fieldsArray = [u,e,p]; 
        fieldsArray.forEach(field => {
            field.value = ""; 
        })
      }


    
    }); 

