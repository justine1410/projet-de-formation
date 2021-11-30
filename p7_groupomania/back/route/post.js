//Imports
const express = require('express');
const messagesCtrl = require('../controllers/postCtrl');
const multer = require('../utils/multer-config');

//route
exports.router=(()=>{
    let apiRouter = express.Router();

    //post
    apiRouter.route('/post/new/').post(multer, messagesCtrl.createPost);
    apiRouter.route('/post/').get(messagesCtrl.getAllPost);
    apiRouter.route('/post/choixPost').post(messagesCtrl.getOnePost);

    //modification de post
    apiRouter.route('/post/modifPost').put(multer, messagesCtrl.MofidyPost)

    //suppression
    apiRouter.route('/post/delete/').post(messagesCtrl.deletePost);
    apiRouter.route('/post/deleteComment').post(messagesCtrl.deleteComment);

    //commentaire
    apiRouter.route('/post/newCommentaire').post(messagesCtrl.createCommentaire);
    apiRouter.route('/post/commentaire').get(messagesCtrl.getAllCommentaire)

    //like dislike
    apiRouter.route('/post/likesDislike').post(messagesCtrl.likeDislikes);

    return apiRouter;
})();