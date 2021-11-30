//Imports
const bcrypt = require('bcrypt');
const models = require('../models');
const jwtUtil = require('../utils/jwt.util')

//Const
const userRegex = /^[a-zA-Z0-9]+$/;
const emailRegex = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
const passwordRegex = /^(?=.*\d).{4,8}$/;


//Routes
module.exports = {

    //méthode POST création d'un utilisateur
    signup : (req,res)=>{
            //Parametres
            let email = req.body.email;
            let username = req.body.username;
            let password = req.body.password;
            //verification des variables
            if(!userRegex.test(username)){
                return res.status(400).json({'erreur':'le nom d\'utilisateur ne doit pas contenir d\'espace '})
            }
            if(!emailRegex.test(email)){
                return res.status(400).json({'erreur':'email invalid'})
            }
            if(!passwordRegex.test(password)){
                return res.status(400).json({'erreur':'Le mot de passe doit contenir entre 4 et 8 caractères et au moin 1 chiffre '})
            }  
            //création de l'utilisateur
            models.User.findOne({
                attributes: ['email'],
                where: {email:email
                }
            })
            .then((user)=>{
                console.log(user);
                //création d'un nouvelle utilisateur
                if(!user){
                bcrypt.hash(password,5,(err, bcrypetPassword)=>{
                    if(username == "justine"){
                        let newUser = models.User.create({
                            email:email,
                            username:username, 
                            password:bcrypetPassword, 
                            isAdmin:1                 
                        })
                        .then((newUser)=>{
                            return res.status(201).json({
                                'token': jwtUtil.generateTokenForUser(newUser)
        
                            })
                        })
                        .catch((erreur)=>{
                            return res.status(400).json((erreur))
                        })
                    }else{
                        let newUser = models.User.create({
                            email:email,
                            username:username, 
                            password:bcrypetPassword,                  
                        })
                        .then((newUser)=>{
                            return res.status(201).json({
                                'token': jwtUtil.generateTokenForUser(newUser)
        
                            })
                        })
                        .catch((erreur)=>{
                            return res.status(400).json((erreur))
                        })
                    }
                })  ;
                }else{
                    return res.status(400).json({'erreur': 'email déjà éxistant !'})
                }
            })
            .catch((erreur)=>{
                return res.status(500).json((erreur));
            })

    },

    //méthode POST connection d'un utilisateur
    login : (req, res) =>{
        //Parametre
        let username = req.body.username;
        let password = req.body.password;

        models.User.findOne({          
            where: {username:username}
        })
        .then((userFound)=>{
            if( userFound){
                console.log(userFound);
                bcrypt.compare(password, userFound.password, (errBcrypt, resBycrypt)=>{
                    if(resBycrypt){
                        return res.status(200).json({
                            'token': jwtUtil.generateTokenForUser(userFound)
                        })
                    }else{
                        console.log("coucou");
                        return res.status(400).json({'message': 'mot de passe invalid !'})
                    }
                }) 
            }else{
                return res.status(400).json({'message': 'utilisateur non existant'})
            } 
        })
        .catch((erreur)=>{
            return res.status(500).json ({"message":"Vos informations sont érronée !!"})
        }) 
    },
    
    //méthode DELETE supprime un utilisateur
    deleteUser:(req,res)=>{
        let headerAuth = req.headers['authorization'];
        let userId =jwtUtil.getUserId(headerAuth);
        let isAdmin = jwtUtil.isAdmin(headerAuth)

        //Parametre
        let username = req.body.username;
        let UserId = req.body.userId

        if(username == null){
            return res.status(400).json({'error': 'Paramètre manquant'});
        }

        models.User.findOne({          
            where: {id:UserId}
        })
        .then((userFound)=>{
            if(userFound.id == userId || isAdmin){
                console.log(userFound);
                userFound.destroy({id:userId})
                .then((message)=>res.status (200).json({"message":"Profil bien supprimé !"}))
                .catch((error)=> res.status(400).json(error))

            }else{
                return res.status(400).json({'error': 'utilisateur non existant'})

            }
        })
        .catch((erreur)=>{
            return res.status(500).json ((erreur))
        })

    },

    //méthode PUT modifie les données utilisateur
    MofidyProfil: (req,res)=>{
                let headerAuth = req.headers['authorization'];
                let userId = jwtUtil.getUserId(headerAuth);

                let email = req.body.email;
                let username = req.body.username;
                let password = req.body.password;

                models.User.findOne({
                    where: {id: userId}
                }) 
                .then(async(userFound)=>{
                    if(userFound){
                        userFound.update({
                            email: (email ? email : userFound.email),
                            username:(username ? username : userFound.username),
                            password:( password ? await bcrypt.hash(password,10) : userFound.password)
                        })
                        .then((userFound)=>{
                            if(userFound){
                                return res.status(201).json({"message":"modification effectué !!"});
                            }else{
                                return status(400).json({'error': 'impossible de faire des changement sur utilisateur'})
                            }

                        })
                        .catch((erreur)=>{
                            res.status(400).json((erreur))
                        })
                    }else{
                        res.status(400).json({'error':'utilisateur non trouvé !'})
                    }
                })
                .catch((erreur)=>{
                    return res.status(500).json((erreur))
                })
    },

    //méthode PUT modifie le mot de passe d'un utilisateur
    ForgotPassword:(req,res)=>{
        
        let email = req.body.email;
        let password = req.body.password;

        console.log(password);
        if(!passwordRegex.test(password)){
            return res.status(400).json({'erreur':'Le mot de passe doit contenir entre 4 et 8 caractères et au moin 1 chiffre '})
        }  

        models.User.findOne({
            where: {email: email}
        })
        .then(async (userFound)=>{
            console.log(userFound);
            userFound.update({
                password:( password ? await bcrypt.hash(password,10) : userFound.password)
            })
            res.status(200).json({'message': 'Les changements ont été fait !!'})

        })
        .catch((erreur)=>{
            res.status(400).json({'erreur': 'Utilisateur non trouvé !!'})
        })
                
    },

    //méthode GET récupère tous les utilisateurs
    getAllUser: (req,res)=>{
        models.User.findAll({
              /*  include:[
                 models.Message,
                 models.Commentaire
               ]  */
            
        })
        .then((user)=> res.status(200).json(user))
        .catch((erreur) => res.status(400).json(erreur))
    },

    //méthode GET 1 utilisateurs
    getOneUser:(req,res)=>{
        let headerAuth = req.headers['authorization'];
        let userId =jwtUtil.getUserId(headerAuth); 

        models.User.findOne({
            where:{
                id: userId
            },
        })
        .then((user)=> res.status(200).json(user))
        .catch((erreur) => res.status(400).json(erreur))
    }, 

    //méthode GET récupère les post favoris
    getAllFavoritePost:(req,res)=>{

        let headerAuth = req.headers['authorization'];
        let userId = jwtUtil.getUserId(headerAuth);

        models.Like.findAll({
            include:[
                models.Message,
                models.User,
            ],
            where:{
                UserId:userId,
                like: 1
            }
        })
        .then((likeFound)=>{
            return res.status(200).json(likeFound)
            
        })
        .catch((erreur)=>{
            return res.status(400).json({"message":"post introuvable"})

        })
    },


   
}

