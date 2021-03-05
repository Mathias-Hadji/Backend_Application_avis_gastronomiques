const multer = require('multer');

// Affecte l'extension de fichier approprié
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Middleware de gestion de fichiers
const storage = multer.diskStorage({
  // Indique à multer d'enregistrer les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // Construction du nom du fichier
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');