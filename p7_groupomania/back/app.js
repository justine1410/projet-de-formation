//import
const express = require('express');
const mysql = require('mysql');
const helmet = require('helmet')
const sanitizeMiddleware = require("sanitize-middleware")

const apiUser = require("./route/user").router;
const apiMessages = require('./route/post').router;
const path = require("path");

//Instantiation du serveur
const app = express();

require('dotenv').config();
//Connexion à la bdd
const db = mysql.createConnection({
  host:process.env.HOST,
  user:process.env.USERDB,
});

db.connect((erreur)=>{
  if (erreur) throw erreur;
  console.log("Connecté à la base de données MySQL");
});

//midleware permettant de débloquer certaine systèmes de sécurité CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, x-access-token"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

//Body Parser configuration
app.use(express.json());

app.use(helmet());

app.use(sanitizeMiddleware())


//Configuration des routes
app.use("/images",  express.static(path.join(__dirname, "images")));
app.use('/api/',  apiUser);
app.use('/api/', apiMessages);

module.exports = app;