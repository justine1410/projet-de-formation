let userLogin = document.getElementById('user_login');
let passwordLogin = document.getElementById('password_login');
let form = document.getElementById('form');

form.addEventListener('submit',(e)=>{
    e.preventDefault();

    let username = userLogin.value;
    let password = passwordLogin.value;
    
    //creation de la clé de session storage
    let local = "user info";

    let login={
        username : username,
        password: password
    };
    //requête de connection
    fetch("http://localhost:8080/api/users/login",{
        headers: {
            'Content-Type': 'application/json',
    },
        method:'POST',
        body: JSON.stringify(login)
    })
    .then(async (response)=>{
        try{
            const resultat = await response.json();
            console.log(resultat);

            if(resultat.token){
                sessionStorage.setItem(local, JSON.stringify(resultat));
                let modalContainer = document.getElementById('modal_container');
                modalContainer.insertAdjacentHTML('afterbegin',`
                <div id="modal">
                    <div id="pop">
                    <p>Vous êtes bien connecté !</p>
                    <a href="actualite.html">ok </a>
                    </div>   
                </div>
                `)
    
            }else if (resultat.errors){
                let modalContainer = document.getElementById('modal_container');
                modalContainer.insertAdjacentHTML('afterbegin',`
                <div id="modal">
                    <div id="pop">
                    <p>${resultat.errors} </p>
                    <a href="login.html">ok </a>
                    </div>   
                </div>
                `)
    
            }else{
                let modalContainer = document.getElementById('modal_container');
                modalContainer.insertAdjacentHTML('afterbegin',`
                <div id="modal">
                    <div id="pop">
                    <p>${resultat.message}</p>
                    <a href="login.html">ok </a>
                    </div>   
                </div>
                `)
            }
        }
        catch(error){
            console.log(error);


        }
    })

})
