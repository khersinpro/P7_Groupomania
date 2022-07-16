const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const post = require('../controllers/post-controller');

router.post("/create", upload.single("postImg"), post.createPost);

module.exports = router;