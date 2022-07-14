const express = require('express');
const router = express.Router();
const user = require('../controllers/user-controller');

router.post('/createuser', user.createUser);
router.post('/connexion', user.connexion);
router.post('/deleteuser', user.deleteUser);
router.get('/getoneuser/:id', user.getOneUser);

module.exports = router;