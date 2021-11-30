//Imports
const express = require('express');
const usersCtrl = require('../controllers/usersCtrl')
const multer = require('../utils/multer-config');
const limiter = require("express-rate-limit")

const loginAccount = limiter({
    windowMs : 1 * 60 * 1000,
    max :2,
    statusCode: 429,
    message: {
        errors : "trop de tentatives veuillez attendre 1 min"
    }
});

//Router
exports.router=(()=>{
    let apiRouter = express.Router();

    //User routes
    apiRouter.route('/users/signup').post(multer, usersCtrl.signup);
    apiRouter.route('/users/login') .post(loginAccount, usersCtrl.login);

    apiRouter.route('/users/unsubscribe') .post(usersCtrl.deleteUser);

    //changement des donnée utilisateur
    apiRouter.route('/users/profil').put(usersCtrl.MofidyProfil);
    apiRouter.route('/users/password').put(usersCtrl.ForgotPassword)

    //Profil
    apiRouter.route('/users/affichProfil').get(usersCtrl.getOneUser);
    apiRouter.route('/users/profilAdmin').get(usersCtrl.getAllUser);
    apiRouter.route('/users/favoritePost').get(usersCtrl.getAllFavoritePost)

    return apiRouter;
})(); 


