let postId = JSON.parse(sessionStorage.getItem("post"));
let infoProfil = JSON.parse(sessionStorage.getItem("user info"));
let token = infoProfil.token
let tokenDecode = JSON.parse(atob(token.split(".")[1]))
let isAdmin = tokenDecode.isAdmin
let userId = tokenDecode.userId


let favoritePost = {
    postId: postId
}

//requête pour récuperation du post 
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
            affichePost(post)
        }
        catch(e){
            console.log(err);
        } 
    }) 

//----------affichage des post ----------// 
function affichePost(e){
    let main = document.getElementById("page")

    let date = e.createdAt.split('T')
    date = date[0].split('-')
    let year = date[0]
    let month = date[1]
    let day = date[2]

    let datePost = `${day}/${month}/${year}`;
        if(!e.User){
            if(e.imageUrl){
                main.innerHTML=`
                <div id="article_container_favoris">
                    <div id="mur">
                        <div id='modal_container' >
                        </div>
                        <div class="article">
                            <div class="auteur">
                                <h5>Publié par :</h5> <p>profil supprimé</p>
                            </div>
                            <div class="create">
                                <h5>Le : </h5> <p>${datePost}</p>
                            </div>
                            <div id="content_favoris">
                                <h2>${e.title}</h2>
                                <div id="image">
                                    <img src="${e.imageUrl}" alt="image post"/>
                                </div>
                                <p>${e.content}</p>
                            </div>
                            <div class="choix_post">
                            <hr>
                                <ul>
                                    <li id = "modif"><i class="fas fa-edit"></i> Modification </li>
                                    <li id = "supp~${e.id}" class="vide"><i class="far fa-trash-alt"></i> Supprimer </li>
                                    <li ><i id="like" class="far fa-thumbs-up">${e.likes}</i><i id="dislike"class="far fa-thumbs-down">${e.dislikes}</i> </li>
                                </ul> 
                                <hr>
                            </div>
                        </div>
                        <div id="new_commentaire">
                            <h2> Laissez un commentaire</h2>
                            <div id="content">
                                <p>Votre commentaire : </p>
                                <textarea id="comment" aria-label="commentaire"></textarea> <br/>
                                <button id="commentaire"> Ajouter votre commentaire </button>
                            </div>
                            <div id="comment${e.id}" class="commenter">
                            </div>
                        </div>
                        <button><a href="actualite.html">RETOUR </a> </button>
                    </div>
                    
                </div>
                ` 
            }else{
                main.innerHTML=`
                <div id="article_container_favoris">
                    <div id="mur">
                        <div id='modal_container' >
                        </div>
                        <div class="article">
                            <div class="auteur">
                                <h5>Publié par :</h5> <p> profil supprimé</p>
                            </div>
                            <div class="create">
                                <h5>Le : </h5> <p>${datePost}</p>
                            </div>
                            <div id="content_favoris">
                                <h2>${e.title}</h2>
                                <p>${e.content}</p>
                            </div>
                            <div class="choix_post">
                            <hr>
                                <ul>
                                    <li id = "modif" ><i class="fas fa-edit"></i> Modification </li>
                                    <li id = "supp~${e.id}" class="vide"><i class="far fa-trash-alt"></i> Supprimer </li>
                                    <li ><i id="like" class="far fa-thumbs-up">${e.likes}</i><i id="dislike"class="far fa-thumbs-down">${e.dislikes}</i> </li>
                                </ul> 
                                <hr>
                            </div>
                        </div>
                        <div id="new_commentaire">
                            <h2> Laissez un commentaire</h2>
                            <div id="content">
                                <p>Votre commentaire : </p>
                                <textarea id="comment" aria-label="commentaire"></textarea> <br/>
                                <button id="commentaire" >Ajouter votre commentaire </button>
                            </div>
                            <div id="comment${e.id}" class="commenter">
                            </div>
                        </div>
                        <button><a href="actualite.html">RETOUR </a> </button>
                    </div>
                    
                </div>
                ` 
            
    
    
            }
        }else{
            if(e.imageUrl){
                main.innerHTML=`
                <div id="article_container_favoris">
                    <div id="mur">
                        <div id='modal_container' >
                        </div>
                        <div class="article">
                            <div class="auteur">
                                <h5>Publié par :</h5><p>${e.User.username}</p>
                            </div>
                            <div class="create">
                                <h5>Le : </h5> <p>${datePost}</p>
                            </div>
                            <div id="content_favoris">
                                <h2>${e.title}</h2>
                                <div id="image">
                                    <img src="${e.imageUrl}" alt="image post"/>
                                </div>
                                <p>${e.content}</p>
                            </div>
                            <div class="choix_post">
                            <hr>
                                <ul>
                                    <li id = "modif"><i class="fas fa-edit"></i> Modification </li>
                                    <li id = "supp~${e.id}" class="vide"><i class="far fa-trash-alt"></i> Supprimer </li>
                                    <li ><i id="like" class="far fa-thumbs-up">${e.likes}</i><i id="dislike"class="far fa-thumbs-down">${e.dislikes}</i> </li>
                                </ul> 
                                <hr>
                            </div>
                        </div>
                        <div id="new_commentaire">
                            <h2> Laissez un commentaire</h2>
                            <div id="content">
                                <p>Votre commentaire : </p>
                                <textarea id="comment" aria-label="commentaire"></textarea> <br/>
                                <button id="commentaire"> Ajouter votre commentaire </button>
                            </div>
                            <div id="comment${e.id}" class="commenter">
                            </div>
                        </div>
                        <button><a href="actualite.html">RETOUR </a> </button>
                    </div>
                    
                </div>
                ` 
            }else{
                main.innerHTML=`
                <div id="article_container_favoris">
                    <div id="mur">
                        <div id='modal_container' >
                        </div>
                        <div class="article">
                            <div class="auteur">
                                <h5>Publié par :</h5><p> ${e.User.username}</p>
                            </div>
                            <div class="create">
                                <h5>Le : </h5> <p>${datePost}</p>
                            </div>
                            <div id="content_favoris">
                                <h2>${e.title}</h2>
                                <p>${e.content}</p>
                            </div>
                            <div class="choix_post">
                            <hr>
                                <ul>
                                    <li id = "modif" ><i class="fas fa-edit"></i> Modification </li>
                                    <li id = "supp~${e.id}" class="vide"><i class="far fa-trash-alt"></i> Supprimer </li>
                                    <li ><i id="like" class="far fa-thumbs-up">${e.likes}</i><i id="dislike"class="far fa-thumbs-down">${e.dislikes}</i> </li>
                                </ul> 
                                <hr>
                            </div>
                        </div>
                        <div id="new_commentaire">
                            <h2> Laissez un commentaire</h2>
                            <div id="content">
                                <p>Votre commentaire : </p>
                                <textarea id="comment" aria-label="commentaire"></textarea> <br/>
                                <button id="commentaire" >Ajouter votre commentaire </button>
                            </div>
                            <div id="comment${e.id}" class="commenter">
                            </div>
                        </div>
                        <button><a href="actualite.html">RETOUR </a> </button>
                    </div>
                    
                </div>
                ` 
            }
        }
   
     //Suppression d'un post
     deletePost(e)

     //like et dislike des post 
     likeDilsike(e)

     //modification d'un post
     modifPost(e)

     //Création des commentaires   
     newComment(e)

     //Affiche des commentaires
     afficheComment(e)
 
}

//----------suppression d'un post / like et dislike / création d'un commentaire / affichage d'un commentaire----------//

//suppression post
function deletePost(e){
    let btnDelete= document.getElementById("supp~"+ e.id);
    let token = infoProfil.token;

    btnDelete.addEventListener("click", (event)=>{
        event.preventDefault();

        let tabId= event.target.id.split("~");
        let idSupp = tabId[1];

        let suppression={
            id : idSupp,
        }
        fetch("http://localhost:8080/api/post/delete/",{
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+' '+token
            },
            method:'POST',
            body: JSON.stringify(suppression)
        })
        .then(async (response)=>{
            try{
                const post = await response.json();
                console.log(post);
                window.location ="actualite.html"
            }
            catch(e){
                console.log("err");
            } 
        })  
    })
} 

//like et dislike
function likeDilsike(e){
    let like = document.getElementById("like");
    let postId = e.id;
    let postUserId = e.UserId
    let token = infoProfil.token


    like.addEventListener("click", (event)=>{
    event.preventDefault()
    if(postUserId == userId){
        
        let modalContainer = document.getElementById('modal_container');
        modalContainer.insertAdjacentHTML('afterbegin',`
        <div id="modal">
            <div id="pop">
            <p>Vous ne pouvez donner votre avis sur vos post !</p>
            <a href="post.html">ok </a>
            </div>   
        </div>
        `)

    }else{
        let like = 1

        let avis ={
            like :like,
            postId : postId
        }
        fetch("http://localhost:8080/api/post/likesDislike",{
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+' '+token
            },
            method:'POST',
            body: JSON.stringify(avis)

        })
        .then(async (response)=>{
            try{
                const post = await response.json();
                console.log(post);
                window.location = "post.html"
            }
            catch(e){
                console.log(err);
            } 
        })  

    }

    })

    let dislike = document.getElementById("dislike");

    dislike.addEventListener("click", (event)=>{
    event.preventDefault()
    if(postUserId == userId){
        let modalContainer = document.getElementById('modal_container');
        modalContainer.insertAdjacentHTML('afterbegin',`
        <div id="modal">
            <div id="pop">
            <p>Vous ne pouvez donner votre avis sur vos post !</p>
            <a href="post.html">ok </a>
            </div>   
        </div>
        `)
    }else{
        let like = -1
        let avis ={
            like :like,
            postId : postId
        }
        fetch("http://localhost:8080/api/post/likesDislike",{
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+' '+token
            },
            method:'POST',
            body: JSON.stringify(avis)

        })
        .then(async (response)=>{
            try{
                const post = await response.json();
                console.log(post);
                window.location = "post.html"
            }
            catch(e){
                console.log(err);
            } 
        })  

    }
    })

}
 
//nouveaux commentaire
function newComment(e){
let commenter = document.getElementById("commentaire");
let token = infoProfil.token
let content = document.getElementById("comment")


commenter.addEventListener("click",(event)=>{
    event.preventDefault()

    let commentaire = {
        MessageId : postId,
        content : content.value,
        pseudo : tokenDecode.username
        
    };

    fetch("http://localhost:8080/api/post/newCommentaire",{
        headers : {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+token
        },
        method : 'POST',
        body: JSON.stringify(commentaire)
    })
    .then( async (response)=>{
        try{
            const post = await response.json();
            console.log(post);
            window.location = "post.html"
        }
        catch(e){
            console.log("err");
        }  
    })  
}) 

}

//affichage d'un commentaire
function afficheComment(e){
let article = document.getElementById("comment"+e.id);
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
                <div class="comment_choix">
                    <ul>
                        <li id="supp_comment"><i class="far fa-trash-alt"></i> Supprimer</li>
                    </ul>
                </div>
            </div>
        `)   

        //Suppression des commentaire
        let suppComment = document.getElementById("supp_comment");
        let idComment =e.Commentaires[j].id
        let token = infoProfil.token

        suppComment.addEventListener("click", (event)=>{
            event.preventDefault();
            let suppression={
                id : idComment,

            }
            fetch("http://localhost:8080/api/post/deleteComment",{
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer'+' '+token
                },
                method:'POST',
                body: JSON.stringify(suppression)
            })
            .then(async (response)=>{
                try{
                    const post = await response.json();
                    console.log(post);
                    window.location = "post.html"
                }
                catch(e){
                    console.log("err");
                } 
            })  
        })

    }
}

//modification post 
function modifPost(e){

    let modif = document.getElementById("modif")

    modif.addEventListener("click", (event)=>{
        event.preventDefault();
        let modal = document.getElementById('modal_container')
        modal.insertAdjacentHTML('afterbegin',`
        <div id="modal_form">
            <form id="myForm" enctype="multipart/form-data">
                <div id="ajout_article">
                    <h2>Modification de votre publication</h2>
                    <p>${tokenDecode.username}</p>
                    <label>Title</label>
                    <input type="text" class='title' name="title"> <br/>
    
                    <label>Image</label>
                    <input type="file" class="add_file" name="image" onchange="document.querySelector('.file').src = window.URL.createObjectURL(this.files[0])"> 
                    <img class="file" />
        
                    <label>Contenu</label>
                    <textarea class="content" name="content"></textarea>
    
                    <button id="modifier">Modifer</button>
                    <button id="annuler"> Annuler</button>
                </div>
            </form>
        </div>
        `)

        let modifier = document.getElementById("modifier");
        let token = infoProfil.token;
        let title=document.querySelector(".title")
        let content= document.querySelector(".content")
        let img = document.querySelector('.add_file');

        modifier.addEventListener('click',(e)=>{
            e.preventDefault();
                formdata = new FormData()
                formdata.append("title",title.value)
                formdata.append("content",content.value)
                formdata.append("image",img.files[0])
                formdata.append("postId",postId)

                fetch("http://localhost:8080/api/post/modifPost",{
                    headers:{
                        'Authorization':'Bearer'+' '+token
                    },
                    method:'PUT',
                    body:  formdata,
                })
                .then(async (response)=>{
                    try{
                        const post = await response.json();
                        console.log(post);
        
                        let modal = document.getElementById('modal_container')
                        modal.innerHTML=" "
                        modal.insertAdjacentHTML('afterbegin',`
                        <div id="modal">
                            <div id="pop">
                            <p>${post.message}</p>
                            <a href="post.html">ok </a>
                            </div>   
                        </div>
                        `)
                    }
                    catch(e){
                        console.log(err);
                    } 
                }) 
            
            
        })
    })

}

