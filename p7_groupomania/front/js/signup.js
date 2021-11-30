let userSign = document.getElementById("user_sign");
let mailSign = document.getElementById("mail_sign");
let passwordSign = document.getElementById("password_sign");
let validForm = document.querySelector("#sign_btn")
let message_valid = document.getElementById('message_valid')


const emailRegex = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
const passwordRegex = /^(?=.*\d).{4,8}$/;
const userRegex = /^[a-zA-Z0-9]+$/;


//Verification des champ pour l'utilisateur
const p = document.querySelectorAll(".message")
const input = document.querySelectorAll("input")

for(let i=0; i<input.length; i++){
    input[i].addEventListener("input", function(e){
        //fonction pour le message d'erreur
        function message(boolean, ok, erreur){
            if(boolean == true){
                p[i].innerHTML = ok;
                p[i].style.color="green";
            }else{
                p[i].innerHTML = erreur;
                p[i].style.color="red";
            }
        }
        //verification des champs
        if(input[i].id =="user_sign"){
            const test = isValid(userRegex, input[i].value);
            message(test,"champ valide", "champ invalide");
        }else if(input[i].id =="mail_sign"){
            const test = isValid(emailRegex, input[i].value);
            message(test, "champ valide", "champ invalide");    
        }else if(input[i].id == "password_sign"){
            const test = isValid(passwordRegex, input[i].value);
            message(test, "champ valide", "champ invalide : Le mot de passe doit contenir entre 4 et 8 caractères et au moins 1 chiffre");
        };
    });
}; 

//Envoie du formulaire
validForm.addEventListener('click',(e)=>{
    e.preventDefault();
    let user = userSign.value;
    let email = mailSign.value;
    let password = passwordSign.value;
    let local = "user info"

    myForm = document.getElementById("form")
    formdata = new FormData(myForm)

    message_valid.innerHTML=` `;
    if(userRegex.test(user) && emailRegex.test(email) && passwordRegex.test(password)){
            fetch("http://localhost:8080/api/users/signup",{
            method:'POST',
            body: formdata
        })
        .then(async (response)=>{
            try{
                const resultat = await response.json();
                console.log(resultat);
                sessionStorage.setItem(local, JSON.stringify(resultat));

                if(resultat.erreur){
                    let modalContainer = document.getElementById('modal_container');
                    modalContainer.insertAdjacentHTML('afterbegin',`
                    <div id="modal"> 
                        <div id="pop">
                        <p>${resultat.erreur}</p>
                        <a href="signup.html">ok </a>
                        </div>   
                    </div>
                    `)    
                }else if(resultat.token){
                    let modalContainer = document.getElementById('modal_container');
                   modalContainer.insertAdjacentHTML('afterbegin',`
                    <div id="modal"> 
                        <div id="pop">
                        <p>Vous êtes bien inscrit</p>
                        <a href="actualite.html">ok </a>
                        </div>   
                    </div>
                    `)    
                }else{
                    let modalContainer = document.getElementById('modal_container');
                   modalContainer.insertAdjacentHTML('afterbegin',`
                    <div id="modal"> 
                        <div id="pop">
                        <p>Pseudo déja existant</p>
                        <a href="signup.html">ok </a>
                        </div>   
                    </div>
                    `)    

                }  
            }
            catch(e){
                console.log(err);
            }
        })
    }else if(!userRegex.test(user)){
        userValid() 
    }else if (!emailRegex.test(email)){
        emailValid()
    }else if(!passwordRegex.test(email)){
        passwordValid()
    }
})

//----------validation des champs a l'écriture----------//
function isValid(regex, valeur){
    return regex.test(valeur);
};

//----------validation des champs a l'envoie----------//
 
function userValid(){
    document.querySelector('.pop_valid');
  
      message_valid.insertAdjacentHTML("afterbegin",`
      <p>le nom d'utilisateur ne doit pas contenir d'espace  </p><br/>
      `)
}

function passwordValid(){
    document.querySelector('.pop_valid');

    message_valid.insertAdjacentHTML("afterbegin",`
    <p>Le mot de passe doit contenir au moin 8 caractère et au moin 1 chiffre </p>
    `)    
}

function emailValid(){
    document.querySelector('.pop_valid');

    message_valid.insertAdjacentHTML("afterbegin",`
    <p>email invalid</p>
    `)
}

  
