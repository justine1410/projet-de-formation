const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth"); //Vérifie que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauce");

router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, sauceCtrl.likeDislike);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);

module.exports = router;
