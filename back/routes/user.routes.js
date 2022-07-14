const express = require('express');
const router = express.Router();
const user = require('../controllers/user-controller');

router.post('/createUser', user.createUser)

module.exports = router;