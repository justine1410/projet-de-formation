const multer = require("multer"); //npm install --save multer

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  //indique a multer où enregistrer les fichier entrants
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  //indique d'utiliser le nom d'origine, de remplacer les espace par des _ , ajoute un timestamp et utilise ensuite MIME_TYPES pour l'extension de fichier
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").slice(0, -1).join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
