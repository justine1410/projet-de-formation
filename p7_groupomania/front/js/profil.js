//Décodage du token
let infoProfil = JSON.parse(sessionStorage.getItem("user info"));
let token = infoProfil.token
let tokenDecode = JSON.parse(atob(token.split(".")[1]))
let isAdmin = tokenDecode.isAdmin




 //Rajoute le formulaire
if(isAdmin == true){
    //affichage post 
    fetch("http://localhost:8080/api/users/profilAdmin")
    .then( async(response) =>{
        try{
            const post = await response.json();
            console.log(post);
            profil(post)

            let table = document.getElementById("table")
            table.insertAdjacentHTML('afterbegin',`
                <tr>
                    <th>Pseudo</th>
                    <th>email</th>
                    <th>Supprimer</th>
                </tr>
            `)
            post.forEach((e)=>{
                table.insertAdjacentHTML('beforeend',`
                    <tr>
                        <td>${e.username}</td>
                        <td>${e.email} </td>
                        <td id="suppr~${e.id}" class="suppAdmin"> supprimer </td>
                    </tr>
                `);   
                
                let suppression = document.getElementById("suppr~"+e.id)

                suppression.addEventListener("click", (event)=>{
                    event.preventDefault()

                    let tabId= event.target.id.split("~");
                    let idSupp = tabId[1];
            
                    let info={
                        username: e.username,
                        userId: idSupp
                    }
                    fetch("http://localhost:8080/api/users/unsubscribe",{
                        headers: {'Content-Type': 'application/json',
                                    'authorization':'Bearer'+' '+token},
                        method:'POST',
                        body: JSON.stringify(info)
                    })
                    .then( async(response) =>{
                        try{
                            const post = await response.json();
                            console.log(post);
                            let modalContainer = document.getElementById('modal_container');
                            modalContainer.insertAdjacentHTML('afterbegin',`
                            <div id="modal">
                                <div id="pop">
                                <p>${post.message}</p>
                                <a href="profil.html">ok </a>
                                </div>   
                            </div>
                            `)
                            
                            localStorage.clear();
                
                            
                        }
                        catch(e){
                            console.log(e);
                        } 
                    }) 
                    .catch((err)=>{
                        console.log(err);
                    }) 
                
                })
            })
        }
        catch(e){
            console.log(e);
        } 
    }) 
    .catch((err)=>{
        console.log(err);
    })
}else{
    profil()
}

//Se déconnecter
let deconnect = document.getElementById("deconnecte");
deconnect.addEventListener('click', (e)=>{
    localStorage.clear()
})

//----------affichage profil / suppression d'un compte / modification d'un profil / affichage des posts favoris----------//

function profil(){
    let profil = document.getElementById("profil")
    let form = document.getElementById("form")

    //affichage profil
     fetch("http://localhost:8080/api/users/affichProfil",{
        headers: {'Content-Type': 'application/json',
                    'authorization':'Bearer'+' '+token},
        method:'GET',
        body: JSON.stringify(tokenDecode.id)
    })
    .then(async(response)=>{
        const User = await response.json();
        console.log(User);
        profil.innerHTML=`
            <div>
                <h2>Bonjour : ${tokenDecode.username} </h2>
                <p>Modifier mon profil</p>
            </div>
            `
        form.innerHTML=`    
            <label>Pseudo</label>
            <input type="text" id="user_sign" placeholder="nouveau pseudo" aria-label="pseudo">
            <p class="message"></p>
        
        
            <label>Adresse mail</label>
            <input type="text" id="mail_sign" placeholder=" nouveau email" aria-label="email">
            <p class="message"></p>
        
        
            <label>Mot de passe</label>
            <input type="password" id="password_sign" placeholder="nouveau mot de passe" aria-label="mot de passe"/>
            <p class="message"></p>  
  
        
        <button type="submit" id="sign_btn">Changer</button>
        
        <p>
            Déja inscrit 
            <a href="login.html" class="unsubscribe">se désinscrire</a>
        </p>
        ` 
        //Se désinscrire
        unsubscribe()

        //modification du compte utilisateur
        modification()
    })
    .catch((err)=>{
        console.log(err);
    }) 
    
    //affichage des posts
    fetch("http://localhost:8080/api/users/favoritePost",{
            headers: {'Content-Type': 'application/json',
                        'authorization':'Bearer'+' '+token},
            method:'GET',
            body: JSON.stringify(tokenDecode.id)
        })
    .then(async(response)=>{
        const favoritePost = await response.json();
        console.log(favoritePost);
        afficheFavoritePost(favoritePost)
           
    })
    .catch((err)=>{
        console.log(err);
    })
}

function unsubscribe(){
    let unsubscribe = document.querySelector(".unsubscribe")
    let token = infoProfil.token;
    let username = tokenDecode.username
    let userId = tokenDecode.userId

    let info={
        username: username,
        userId: userId
    }

    unsubscribe.addEventListener('click', (e)=>{
        e.preventDefault();
        fetch("http://localhost:8080/api/users/unsubscribe",{
            headers: {'Content-Type': 'application/json',
                        'authorization':'Bearer'+' '+token},
            method:'POST',
            body: JSON.stringify(info)
        })
        .then( async(response) =>{
            try{
                const post = await response.json();
                console.log(post);
                
                let modalContainer = document.getElementById('modal_container');
                modalContainer.insertAdjacentHTML('afterbegin',`
                <div id="modal">
                    <div id="pop">
                    <p>${post.message}</p>
                    <a href="index.html">ok </a>
                    </div>   
                </div>
                `)
                
                localStorage.clear();
    
                
            }
            catch(e){
                console.log(e);
            } 
        }) 
        .catch((err)=>{
            console.log(err);
        })

    })
}

function modification(){
    let modifyEmail = document.getElementById('mail_sign');
    let modifyinfoProfil = document.getElementById('user_sign');
    let modifyPass = document.getElementById('password_sign')
    let modification = document.getElementById('sign_btn');


    modification.addEventListener('click',(e)=>{
        e.preventDefault();
    let userInfo={
            email: modifyEmail.value,
            username: modifyinfoProfil.value,
            password: modifyPass.value
        }

        fetch("http://localhost:8080/api/users/profil",{
            headers:{'Content-Type':'application/json',
                    'authorization':'Bearer'+' '+token},
            method:'PUT',
            body: JSON.stringify(userInfo)
        })

        .then(async (response)=>{
            try{
                const resultat = await response.json();
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
                        <a href="profil.html">ok </a>
                        </div>   
                    </div>
                    `) 
                }
                console.log(resultat);
            }
            catch(e){
                console.log(err);
            } 
        }) 
    })
}

function afficheFavoritePost(favoritePost){
    let articleFavoris = document.getElementById("article_favoris")

    favoritePost.forEach((e)=>{
        let date = e.createdAt.split('T')
        date = date[0].split('-')
        let year = date[0]
        let month = date[1]
        let day = date[2]
        let datePost = `${day}/${month}/${year}`;

        articleFavoris.insertAdjacentHTML('afterbegin',`
                <div class="article">
                    <div class="create">
                        <h5>Le : </h5> <p>${datePost}</p>
                    </div>
                    <div id="content">
                        <h2>${e.Message.title}</h2>
                    </div>
                </div>
        `)

        let article = document.querySelector(".article")
        article.addEventListener("click",(event)=>{
            event.preventDefault();
            let favoritePost = {
                postId: e.Message.id
            }
            
            fetch("http://localhost:8080/api/post/choixPost",{
                headers:{
                    'Content-type': 'application/json',
                    'Authorization':'Bearer'+' '+token
                },
                method:'POST',  
                body: JSON.stringify(favoritePost)
            })
            .then(async (response)=>{
                try{
                    const post = await response.json();
                    console.log(post);
                    let postId = e.Message.id
                    let posts = "post"
        
                    sessionStorage.setItem(posts, JSON.stringify(postId));
                    window.location = "post.html"
        
                }
                catch(e){
                    console.log(err);
                } 
            }) 
        })

    })
}
