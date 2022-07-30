const express = require('express');
const router = express.Router();
const {createCom, deleteCom, getPostComs} = require('../controllers/com-controller');
const {auth} = require('../middleware/auth');
const { sanitizationCom } = require('../middleware/input-validate');
const userOrAdmin = require('../middleware/userAdmin');

router.post('/create', auth, sanitizationCom, createCom);
router.delete('/delete', auth, userOrAdmin, deleteCom);
router.get('/getpostcom/:id', auth, getPostComs);

module.exports = router