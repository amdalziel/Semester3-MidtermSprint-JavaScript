
window.addEventListener("DOMContentLoaded", function () {

    let submitBtn = document.getElementById("submit-btn");
    

    submitBtn.addEventListener("click", function(e) { 
        e.preventDefault(); 
        let userValue = document.getElementById("username").value;
        let emailValue = document.getElementById("email").value; 
        let phoneValue = document.getElementById("phone").value; 
        // console.log('click'); 
        // console.log(userValue); 
        // console.log(emailValue);
        // console.log(phoneValue); 
        newToken(userValue, emailValue, phoneValue); 
        newWebToken();  
   
    }); 

    async function newWebToken() {
        try {
            console.log("newWebTokens()"); 
            const res = await fetch('../json/tokens.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tokenData)
            }); 

            if (!res.ok) {
                throw new Error('Error!!');
            }

            const data = await res.json();
            console.log('Token stored successfully:', data);
            
        } catch (error) {
            if (error) throw new Error; 
        }


    }


function newToken(userName, email, phone) {
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
    newToken.expires = expires; //format 
  
    console.log(newToken); 
    return newToken.token;
  }
  
  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
    
    }); 