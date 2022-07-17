const express = require('express');
const router = express.Router();
const {createCom, deleteCom} = require('../controllers/com-controller');

router.post('/create', createCom);
router.delete('/delete', deleteCom);

module.exports = router