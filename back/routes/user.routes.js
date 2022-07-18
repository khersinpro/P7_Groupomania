const express = require('express');
const router = express.Router();
const user = require('../controllers/user-controller');
const auth = require('../middleware/auth');

router.post('/createuser', user.createUser);
router.post('/connexion', user.connexion);
router.post('/deleteuser', auth, user.deleteUser);
router.get('/getuser', auth,  user.getUser);

module.exports = router;