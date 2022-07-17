const express = require('express');
const router = express.Router();
const {createCom, deleteCom, getAllComs} = require('../controllers/com-controller');

router.post('/create', createCom);
router.delete('/delete', deleteCom);
router.get('/getall', getAllComs);

module.exports = router