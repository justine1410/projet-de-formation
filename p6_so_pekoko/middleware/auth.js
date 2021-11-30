const jwt = require("jsonwebtoken");

require("dotenv").config();

//Vérifie que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes
module.exports = (req, res, next) => {
  try {
    //récupération du token, grâce a split nous prenons tous aprés bearer l'espace dans le header
    const token = req.headers.authorization.split(" ")[1];
    //vérifie que le TOKEN est valide
    const decodedToken = jwt.verify(token, process.env.token);
    //récupération de l'id utilisateur du TOKEN
    const userId = decodedToken.userId;
    //si l'id est correspondant c'est bon sinon il y a une erreur
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request ! "),
    });
  }
};
