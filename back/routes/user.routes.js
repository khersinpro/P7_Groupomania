const express = require('express');
const router = express.Router();
const user = require('../controllers/user-controller');
const auth = require('../middleware/auth');
const upload = require("../middleware/multer");
// Middleware de controle des entrées
const {signupControl, loginControl, modifyPasswordControl} = require('../middleware/input-validate');
// Middleware pour eviter des attaques de spam / force brute
const {connexionLimiter, createAccountLimiter} = require("../middleware/rate-limit");

router.post('/createuser', createAccountLimiter, signupControl, user.createUser);
router.post('/connexion', connexionLimiter, loginControl, user.connexion);
router.get('/getuser', auth, user.getUser);
router.post('/changeavatar', auth, upload.single("image"), user.modifyAvatar);
router.put('/modifypassword', auth, modifyPasswordControl, user.modifiyPassword)
router.get('/logout/:id', auth, user.logout )

module.exports = router;