const express = require('express');
const router = express.Router();
const user = require('../controllers/user-controller');
const auth = require('../middleware/auth');
const upload = require("../middleware/multer");

router.post('/createuser', user.createUser);
router.post('/connexion', user.connexion);
router.post('/deleteuser', auth, user.deleteUser);
router.get('/getuser', auth, user.getUser);
router.post('/changeavatar', auth, upload.single("image"), user.modifyAvatar);
router.put('/modifypassword', auth, user.modifiyPassword)
router.get('/logout/:id', auth, user.logout )

module.exports = router;