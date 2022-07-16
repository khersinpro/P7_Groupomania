const multer = require('multer');
//*** CONTROL OK ***/

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if(file.fieldname === 'image'){
      callback(null , 'images/user_avatar');

    }else if(file.fieldname === "postImg"){
      callback(null , 'images/post_images');
    };
  },

  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];

    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({storage: storage});

module.exports = upload;