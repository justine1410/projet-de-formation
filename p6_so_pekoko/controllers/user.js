const User = require("../models/user");
const brcypt = require("bcrypt"); //permet de crypter le mot de passe
const jwt = require("jsonwebtoken");
const Buffer = require("buffer/").Buffer;

exports.signup = (req, res, next) => {
  const buf = new Buffer.from(JSON.stringify(req.body.email));
  //const buf = Buffer.from("req.body.email");
  //appel de la fonction hash de bcrypt et demande de saler le mdp 10 fois
  brcypt
    .hash(req.body.password, 10)

    //creation d'un utilisateur et enregistrement dans la bd
    .then((hash) => {
      const user = new User({
        email: buf.toString("base64"), //
        //permet de stocker le mot de passe de façon sécurisé dans la base de donnée
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

require("dotenv").config();
exports.login = (req, res, next) => {
  const buf = new Buffer.from(JSON.stringify(req.body.email));
  //const buf = Buffer.from("req.body.email");

  //modele Mongoose pour vérifier que l'email entré et bien existant dans la bd
  User.findOne({ email: buf.toString("base64") }) //
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      }
      //Compare le mdp entré avec la hash enregistré
      brcypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            //encode un nouveau TOKEN
            token: jwt.sign({ userId: user._id }, process.env.token, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json("error"));
};
