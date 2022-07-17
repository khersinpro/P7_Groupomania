const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const post = require('../controllers/post-controller');

// upload un seul fichier avec un fieldname(key) postImg
router.post("/create", upload.single("postImg"), post.createPost);
router.put("/modify", upload.single("postImg"), post.modifyPost);
router.delete("/delete", post.deletePost);
router.post('/likes', post.likes);

module.exports = router;