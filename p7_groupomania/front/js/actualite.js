let infoProfil = JSON.parse(sessionStorage.getItem("user info"));
let token = infoProfil.token
let tokenDecode = JSON.parse(atob(token.split(".")[1]))
let isAdmin = tokenDecode.isAdmin
let userId = tokenDecode.userId

//Se déconnecter
let deconnect = document.getElementById("deconnecte");
deconnect.addEventListener('click', (e)=>{
    sessionStorage.removeItem('user info')
})

//requête pour afficher les post 
fetch("http://localhost:8080/api/post/")
.then( async(response) =>{
    try{
        const post = await response.json();
        console.log(post);  
        affichePost(post)
    }
    catch(e){
        console.log(e);
    } 
}) 
.catch((err)=>{
    console.log(err);
}) 

//Création post
let publication = document.getElementById("publication");

publication.addEventListener('click',(e)=>{
    e.preventDefault()
    let myFormulaire= document.getElementById('my_form')
    myFormulaire.insertAdjacentHTML('afterbegin',`
    <div id="my_Form">
        <form id="myForm" enctype="multipart/form-data">
            <div id="ajout_article">
                <h2>Créer une publication</h2>
                <p>${tokenDecode.username}</p>
                <label>Title</label>
                <input type="text" class='title' name="title" aria-label="titre"> <br/>

                <label>Image</label>
                <input type="file" class="add_file" name="image" onchange="document.getElementById('file').src = window.URL.createObjectURL(this.files[0])"> 
                <img id="file"   />

                <label>Contenu</label>
                <textarea class="content" name="content" aria-label="contenu"></textarea>

                <button class="ajouter">Ajouter</button>
                <button class="annuler"> Annuler</button>
            </div>
        </form>
    </div>
    `)
    

    let ajouter = document.querySelector(".ajouter");
    let img = document.querySelector('.add_file');

    let token = infoProfil.token;

    ajouter.addEventListener('click',(e)=>{
        e.preventDefault();


        formdata = new FormData(myForm)


        fetch("http://localhost:8080/api/post/new/",{
            headers:{
                'Authorization':'Bearer'+' '+token
            },
            method:'POST',
            body:  formdata

        })
        .then(async (response)=>{
            try{
                const post = await response.json();
                console.log(post);

               window.location = "actualite.html"
            }
            catch(e){
                console.log(err);
            } 
        }) 
    })
 

});

//----------affichage des post ----------// 
 function affichePost(post){
    let mur = document.getElementById("mur")

    post.forEach(function(e){
        let date = e.createdAt.split('T')
        date = date[0].split('-')
        let year = date[0]
        let month = date[1]
        let day = date[2]

        let datePost = `${day}/${month}/${year}`;

        if(!e.User){
            if(!e.imageUrl){
                mur.insertAdjacentHTML('afterbegin',`
                <div class="article">
                     <div class="auteur">
                         <h5>Publié par :</h5> <p> profil supprimer</p>
                     </div>
                     <div class="create">
                         <h5>Le : </h5> <p>${datePost}</p>
                     </div>
                     <div class="content">
                         <h2>${e.title}</h2>
                         <p>${e.content}</p>
                     </div>
                    
                     <div class="comment${e.id}">
                     </div>
                 </div>
                </div>
                `)
            }else{
                mur.insertAdjacentHTML('afterbegin',`
                <div class="article">
                     <div class="auteur">
                         <h5>Publié par :</h5> <p>profil supprimé</p>
                     </div>
                     <div class="create">
                     <h5>Le : </h5> <p>${datePost}</p>
                     </div>
                     <div class="content">
                         <h2>${e.title}</h2>
                         <img src="${e.imageUrl}" alt="image du post" aria-label="image du post"/>
                         <p>${e.content}</p>
                     </div>
                     <div class="comment${e.id}">
                     </div>
                 </div>
                </div>
                `)
            }
        }else{
            if(!e.imageUrl){
                mur.insertAdjacentHTML('afterbegin',`
                <div class="article">
                     <div class="auteur">
                         <h5>Publié par :</h5> <p> ${e.User.username}
                        </p>
                     </div>
                     <div class="create">
                         <h5>Le : </h5> <p>${datePost}</p>
                     </div>
                     <div class="content">
                         <h2>${e.title}</h2>
                         <p>${e.content}</p>
                     </div>
                    
                     <div class="comment${e.id}">
                     </div>
                 </div>
                </div>
                `)
            }else{
                mur.insertAdjacentHTML('afterbegin',`
                <div class="article">
                     <div class="auteur">
                     <h5>Publié par :</h5> <p>${e.User.username}
                     </div>
                     <div class="create">
                     <h5>Le : </h5> <p>${datePost}</p>
                     </div>
                     <div class="content">
                         <h2>${e.title}</h2>
                         <img src="${e.imageUrl}" alt="image du post" aria-label="image du post"/>
                         <p>${e.content}</p>
                     </div>
                     <div class="comment${e.id}">
                     </div>
                 </div>
                </div>
                `)
            }
        }

       let article = document.querySelector(".content")

        article.addEventListener("click",(event)=>{
            event.preventDefault();
            let postId = e.id
            let post = "post"

            sessionStorage.setItem(post, JSON.stringify(postId));
            window.location = "post.html"
        })
        //Affiche des commentaires
        afficheComment(e)
    
   })
}

//---------- affichage des commentaire----------//
function afficheComment(e){
let article = document.querySelector(".comment"+e.id);
    for(j=0; j<e.Commentaires.length; j++){
        
        let date = e.createdAt.split('T')
        date = date[0].split('-')
        let year = date[0]
        let month = date[1]
        let day = date[2]

        let datePost = `${day}/${month}/${year}`;

        article.insertAdjacentHTML('afterend',`
            <div class="comment">
                <div class="auteur">
                    <h5>publié par :</h5>
                    <p>${e.Commentaires[j].pseudo} </p>
                </div>
                <div class="create">
                    <h5>Le : </h5> <p>${datePost}</p>
                </div>
                <div class="comment_content">
                    <p >${e.Commentaires[j].content}</p>

                </div>
            </div>
        `)   
    }
}


