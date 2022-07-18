const express = require('express');
const router = express.Router();
const {createCom, deleteCom, getAllComs} = require('../controllers/com-controller');
const auth = require('../middleware/auth');

router.post('/create', auth, createCom);
router.delete('/delete', auth, deleteCom);
router.get('/getall', auth, getAllComs);

module.exports = router