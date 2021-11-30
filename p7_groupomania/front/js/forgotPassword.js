let newPass = document.querySelector(".new_pass");
let newPassAgain = document.querySelector(".new_pass_again");
let email = document.querySelector(".adresse")

let modifyPassword = document.querySelector("#modify_password");

modifyPassword.addEventListener("click", (event)=>{
    event.preventDefault()

    let modifPass ={
        email: email.value,
        password: newPass.value
    }

    if(newPass.value === newPassAgain.value){
        fetch("http://localhost:8080/api/users/password",{
            headers:{'Content-Type':'application/json',
                    //'authorization':'Bearer'+' '+token
                },
            method:'PUT',
            body: JSON.stringify(modifPass)
        })
        .then(async (response)=>{
            try{
                const resultat = await response.json();
                console.log(resultat);
                if(resultat.message){
                    let modalContainer = document.getElementById('modal_container');
                    modalContainer.insertAdjacentHTML('afterbegin',`
                    <div id="modal">
                        <div id="pop">
                        <p>${resultat.message}</p>
                        <a href="login.html">ok </a>
                        </div>   
                    </div>
                    `)
                }else{
                    let modalContainer = document.getElementById('modal_container');
                    modalContainer.insertAdjacentHTML('afterbegin',`
                    <div id="modal">
                        <div id="pop">
                        <p>${resultat.erreur}</p>
                        <a href="">ok </a>
                        </div>   
                    </div>
                    `)
    
                }
            }
            catch(e){
                console.log(err);
            } 
        })
        
    } else{
        let modalContainer = document.getElementById('modal_container');
        modalContainer.insertAdjacentHTML('afterbegin',`
        <div id="modal">
            <div id="pop">
            <p>les champs du mot de passe ne sont pas les mêmes</p>
            <a href="forgotPassword.html">ok </a>
            </div>   
        </div>
        `)
    }


})

