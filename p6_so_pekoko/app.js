const express = require("express");
//aide a protéger l'application de certaine vulnérabilités en configurant de manière approrpiée des en-tête
const helmet = require("helmet");
const bodyParser = require("body-parser");
//nettoi les données fournies par l'utilisateur pour empêcher les injections(nettoie les $ ou les .)
const mongoSanitize = require("express-mongo-sanitize");
//facilite les interaction avec la base de données
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

const app = express();

require("dotenv").config();
//connexion a mongoose
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER +
      ":" +
      process.env.DB_PASS +
      "@" +
      process.env.DB_URL +
      "/" +
      process.env.DB_NAME +
      "?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  .then(() => console.log("connexion à MongoDB réussie!"))
  .catch(() => console.log("connexion à MongoDB échouée !"));

//midleware permettant de débloquer certaine systèmes de sécurité CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

//Transforme les données POST en un objet JSON
app.use(bodyParser.json());

app.use(mongoSanitize());

app.use(helmet());

//indique de gérer la ressource images en statique
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
