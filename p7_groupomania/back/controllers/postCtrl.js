//Import
let models = require('../models');
let jwtUtil = require('../utils/jwt.util');
const fs = require("fs")

//Const
let titleLimit = 2;
let contentLimit = 2;  

//Routes
module.exports = {
    //méthode POST création post
     createPost: async (req, res)=>{
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtil.getUserId(headerAuth);

        //Vérification des paramètres
        let title = req.body.title;
        let content = req.body.content;
        let image = req.file

        if (title == null || content == null){
            return res.status(400).json({'error': 'paramètre manquant'})
        }

        if(title.length <= titleLimit || content.length <= contentLimit ){
                return res.status(400).json({'error': 'paramètre invalide'})
        }   
        models.User.findOne({
            where:{ id: userId}
        })
        //création d'un post
        .then(( messageFound ) =>{ 
            if(image){
                let newPost = models.Message.create({
                    title : title,
                    content: content,
                    imageUrl:`${req.protocol}://${req.get("host")}/images/${req.file.filename}`, 
                    likes: 0,
                    dislikes:0,
                    UserId: messageFound.id,
                })              
                
                .then((newPost)=>{
                    return res.status(201).json(newPost)
                })
                .catch((erreur)=>{
                    return res.status(400).json("erreur");
                })
            }else{   
                let newPost = models.Message.create({
                    title : title,
                    content: content,
                    likes: 0,
                    dislikes:0,
                    UserId: messageFound.id
                }) 
                .then((newPost)=>{
                    return res.status(201).json(newPost)
                })
                .catch((erreur)=>{
                    return res.status(400).json("erreur");
                })
            }
        })
        .catch((erreur)=>{
            return res.status(500).json(("erreurs"));
        })
    },

    //méthode POST ajout d'un commentaire
    createCommentaire: (req,res)=>{
            let headerAuth = req.headers['authorization'];
            let userId =jwtUtil.getUserId(headerAuth);
    
    
            let postId = req.body.MessageId;
            let pseudo = req.body.pseudo;
            let content = req.body.content;
    
            models.Message.findOne({
                where:{id:postId}
            })
            //création d'un commentaire
            .then((messageFound)=>{
                let newComment = models.Commentaire.create({
                    content: content,
                    MessageId: messageFound.id,
                    UserId: userId,
                    pseudo: pseudo
                })
                .then((newComment)=>{
                    return res.status(200).json(newComment)
                })
                .catch((erreur)=>{
                    return res.status(400).json((erreur))
                })
    
            })
            .catch((erreur)=>{
                return res.status(400).json((erreur))
            })
    },
    
    //méthode POST liker et disliker un post
    likeDislikes: async (req,res)=>{
        let headerAuth = req.headers['authorization'];
        let userId =jwtUtil.getUserId(headerAuth); 

        let postId = req.body.postId
        let like = req.body.like
           
        let postLike =await models.Like.findOne({
            where:{
                MessageId: postId,
                UserId: userId
            }    
        }) 
        switch (like){
            case 1:
                if(postLike){
                    if(postLike.like == 1){
                        return res.status(200).json({"message":"message déjà liké !!"})    
                    }else if( postLike.like == -1){
    
                        postLike.update({
                            like:like
                        })
                        models.Message.findOne({
                            where:{
                                id: postId,
                            }
                        })
                        .then((messageFound)=>{
                            messageFound.increment({
                                likes:1,
                                dislikes:-1
                            })
                            return res.status(200).json({"message":"message liké !!"})    
                        })
                        .catch((erreur)=>{
                            res.status(400).json({"erreur":"like impossible"})
                        })
                    }
                }else{
                    let newLike= models.Like.create({
                        UserId: userId,
                        MessageId: postId,
                        like: like
                    })
                    models.Message.findOne({
                        where:{
                            id: postId,
                        }
                    })
                    .then((messageFound)=>{
                        messageFound.increment({
                            likes:1
                        })
                        return res.status(200).json({"message":"message liké !!"})    
                    })
                    .catch((erreur)=>{
                        res.status(400).json({"erreur":"like impossible"})
                    })
                }
            break;
            case -1:
                if(postLike){
                    if(postLike.like == -1){
                        console.log("coucou " +postLike.like);
                        return res.status(200).json({"message":"message déjà disliké !!"})    
                    }else if( postLike.like == 1){
                        console.log("hello " +postLike);
    
                        postLike.update({
                            like:like
                        })
                        models.Message.findOne({
                            where:{
                                id: postId,
                            }
                        })
                        .then((messageFound)=>{
                            messageFound.increment({
                                dislikes:1,
                                likes:-1
                            })
                            return res.status(200).json({"message":"message disliké !!"})
                        })
                        .catch((erreur)=>{
                            res.status(400).json({"erreur":"like impossible"})
                        })
                    }
                }else{
                    let newLike= models.Like.create({
                        UserId: userId,
                        MessageId: postId
                    })
                    models.Message.findOne({
                        where:{
                            id: postId,
                        }
                    })
                    .then((messageFound)=>{
                        messageFound.increment({
                            dislikes:1,
                        })
                        return res.status(200).json("dislike ajouté !!")
                    })
                    .catch((erreur)=>{
                        res.status(400).json({"erreur":"dislike impossible"})
                    })
                }
            break;

        }
    },
    
     //méthode GET affichage des post
    getAllPost: (req,res)=>{
        models.Message.findAll({
               include:[
                 models.User,
                 models.Commentaire
               ],
               order : [
                ['id', 'ASC']
               ]
            
        },
        
        
        )
        .then((message)=> res.status(200).json(message))
        .catch((erreur) => res.status(400).json(erreur))
    },

    //méthode GET affiche un post
    getOnePost: (req,res)=>{

        let postId = req.body.postId

        models.Message.findOne({
            where:{
                id: postId
            },
            include:[
                models.User,
                models.Commentaire
              ]
        })
        .then((messageFound)=> res.status(200).json(messageFound))
        .catch((erreur) => res.status(400).json(erreur))

    },

    //méthode GET affichage d'un commentaire
    getAllCommentaire: (req,res)=>{
        models.Commentaire.findAll({
            include:[{
                model: models.User,
                attributes:['content']
            }]
        })
        .then((commentaire)=>res.status(200).json(commentaire))
        .catch((erreur) => res.status(400).json(erreur))
    },
  
    //méthode PUT modification de post
    MofidyPost:(req,res)=>{
        let headerAuth = req.headers['authorization'];
        let userId =jwtUtil.getUserId(headerAuth); 


        let title = req.body.title;
        let content = req.body.content;
        let image = req.file;
        let postId = req.body.postId;

        models.Message.findOne({
            where: {
                id : postId,
                UserId : userId
            }
        })
        .then((messageFound)=>{
            console.log(messageFound);
            if(messageFound){
                if(image){
                    let imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                    messageFound.update({
                        title : (title ? title : messageFound.title),
                        content : (content ? content : messageFound.content),
                        imageUrl : (imageUrl ? imageUrl : messageFound.imageUrl)
                    })
                    res.status(200).json({"message" : "post modifié ! "})
                }else{
                    messageFound.update({
                        title : (title ? title : messageFound.title),
                        content : (content ? content : messageFound.content),
                    })
                    res.status(200).json({"message" : "post modifié ! "})
        
                }
            }else{
                res.status(200).json({"message" : "vous ne pouvez pas modifier ce post ! "})
            }

        })
        .catch((erreur)=>{
            res.status(400).json({'error':'post non trouvé !'})
        })
    },

    //méthode DELETE suppression post
    deletePost: (req,res)=>{
        let headerAuth = req.headers['authorization'];
        let userId =jwtUtil.getUserId(headerAuth);
        let isAdmin = jwtUtil.isAdmin(headerAuth);

        let postId = req.body.id;
        console.log(isAdmin);

        models.Message.findOne({
            where:{
                id: postId,
            }
        })
        .then((postFound)=>{
            console.log(postFound.imageUrl);
            console.log(userId);
            if(postFound.UserId == userId || isAdmin){
                if(postFound.imageUrl){
                    const filename = postFound.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${filename}`,() =>{
                        postFound. destroy({ id: postId })
                        .then(
                            res.status(200).json({"message":"Post supprimé !"})
                        )
                        .catch((erreur)=> res.status(400).json ((erreur)))
                    })

                }else{
                    postFound. destroy({ id: postId })
                    .then(
                        res.status(200).json({"message":"Post supprimé !"})
                    )
                    .catch((erreur)=> res.status(400).json ((erreur)))

                }

            }else{
                return res.status(404).json({"message": "Vous n'avez pas les autorisations pour supprimer ce post"})
            }

        })
        .catch((erreur)=>{
            return res.status(400).json({"erreur":erreur})
        })
        
    } ,

    //méthode DELETE suppression commentaire
    deleteComment: (req,res)=>{
        let headerAuth = req.headers['authorization'];
        let userId =jwtUtil.getUserId(headerAuth);
        let isAdmin = jwtUtil.isAdmin(headerAuth);


        let commentId = req.body.id;


        models.Commentaire.findOne({
            where:{
                id: commentId,
            }
        })
        //suppression du comentaire
        .then((commentaireFound)=>{
            if(commentaireFound.UserId == userId || isAdmin){
                commentaireFound. destroy({ id: commentId})
                .then(
                    res.status(200).json({"message":"Commentaire supprimé !"})
                )
                .catch((erreur)=> res.status(400).json ((erreur)))
            
                
            } else {
               return res.status(400).json({"message":"Vous n'avez pas l'autorisation de supprimer ce commentaire"});
            }
        })
        
    },

}
  
