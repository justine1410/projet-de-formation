const Sauce = require("../models/sauce");
const fs = require("fs");

//méthode POST créé une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //suppresion de l'id généré par la front end, car il est crée par mongoDB
  delete sauceObject._id;
  const sauce = new Sauce({
    //copie tous les éléments de req.body
    ...sauceObject,
    //modification de l'url de l'image, pour avoir une url complète
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    userLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json(error));
};

//méthode GET affiche une sauce
exports.getOneSauce = (req, res, next) => {
  //utilisation de la méthode find pour obtenir l'id qui se trouve dans la requête puis envoie de la sauce demandé
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json(error));
};

//méthode PUT modifie une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? //utilisation d'un opérateur ternaire équivalent à if(){} else {}
      {
        //modification des données et rajout d'une nouvelle image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : //sinon on traite juste les données
      { ...req.body };
  //permet de mettre a jour la sauce avec l'id de la requête du 1er paramètre et le remplacer par l'id du 2eme paramètre
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifié !" }))
    .catch((error) => res.status(400).json(error));
};

//méthode DELETE supprime une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //récupération de l'url de la sauce, méthose split autour du nom du fichier
      const filename = sauce.imageUrl.split("/images/")[1];
      //avec ce nom on fat unlink pour suppr le fichier
      fs.unlink(`images/${filename}`, () => {
        //suppression la sauce correspondant à l'id de la requête
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(400).json(error));
      });
    })
    .catch((error) => res.status(500).json(error));
};

//méthode GET pour toutes les sauces
exports.getAllSauces = (req, res, next) => {
  //utilisation de la méthode find pour obtenir la liste des sauces puis envoi d'un tableau de toutes les sauces
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json(error));
};

//méthode like ou disliked une sauce
exports.likeDislike = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;

  switch (like) {
    //si c'est un like
    case 1:
      Sauce.updateOne(
        { _id: sauceId },
        //ajoute l'utilisateur dans le tableau et incrément 1
        {
          $push: { usersLiked: userId },
          $inc: { likes: +1 },
        }
      )
        .then(() => res.status(200).json({ message: "J'aime ajouté !" }))
        .catch((error) => res.status(400).json(error));
      break;
    //si c'est une annulation d'un like ou dislike
    case 0:
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          //si userId est dans le tableau userliked on l'enleve et on enleve un like
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $pull: { usersLiked: userId },
                $inc: { likes: -1 },
              }
            )
              .then(() => res.status(200).json({ message: "J'aime retiré !" }))
              .catch((error) => res.status(400).json(error));
          }
          //si userId et dans le tableau userDisliked on l'enleve et on enleve un dislike
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $pull: { usersDisliked: userId },
                $inc: { disLikes: -1 },
              }
            )
              .then(() =>
                res.status(200).json({ message: "Je n'aime pas retiré !" })
              )
              .catch((error) => res.status(400).json(error));
          }
        })
        .catch((error) => res.status(400).json(error));
      break;
    //si c'est un dislike
    case -1:
      Sauce.updateOne(
        { _id: sauceId },
        //supprime l'utilisateur du tableau et enlève 1
        {
          $push: { usersDisliked: userId },
          $inc: { dislikes: +1 },
        }
      )
        .then(() => res.status(200).json({ message: "Je n'aime pas !" }))
        .catch((error) => res.status(400).json(error));
      break;
  }
};
