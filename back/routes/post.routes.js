const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const post = require('../controllers/post-controller');
const {auth} = require('../middleware/auth');
const userOrAdmin = require('../middleware/userAdmin');
const {sanitizationPost} = require('../middleware/input-validate');

// upload un seul fichier avec un fieldname(key) postImg
router.post("/create", auth, upload.single("postImg"), sanitizationPost, post.createPost);
router.put("/modify", auth, upload.single("postImg"), sanitizationPost, userOrAdmin,  post.modifyPost);
router.put("/imagedelete", auth, userOrAdmin, post.deletePostImage);
router.delete("/delete", auth, userOrAdmin, post.deletePost);
router.post('/likes', auth, post.likes);
router.get('/getall/:id', auth, post.getAllPost); 
router.get('/getpostlikes/:id', auth, post.getPostLikes )

module.exports = router;