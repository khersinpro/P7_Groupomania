const multer = require('multer');
//*** CONTROL OK ***/

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};

// Fonction de stockage de multer
const storage = multer.diskStorage({
    // Destination du stokage selon le fieldname(key) image/postImg
    destination: (req, file, callback) => {
        if(file.fieldname === 'image'){
            callback(null , 'images/user_avatar');
        }else if(file.fieldname === "postImg"){
            callback(null , 'images/post_images');
        };
    },
    // Création d'un nom unique pour le stockage de l'image
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// On indique a multer les options de stockage
const upload = multer({storage: storage});

// On exporte multer
module.exports = upload;