const router = require("express").Router()
const { createPostCtrl, getAllPostsCtrl, getSenglePostCtrl, getPostCountCtrl, deletePostCtrl, updatePostCtrl, updatePostImageCtrl, toggleLikeCtrl } = require("../controllers/postController")
const photoUpload = require("../middlewares/photoUpload")
const validateOpjectId = require("../middlewares/validateOpjectId")
const { verifyToken } = require("../middlewares/virfyToken")


// api/posts
router.route("/")
    .post(verifyToken, photoUpload.single("image"), createPostCtrl )
    .get(getAllPostsCtrl)

// api/posts/count
router.route("/count")
     .get(getPostCountCtrl)


// api/posts/:id
router.route("/:id")
     .get(validateOpjectId, getSenglePostCtrl)
     .delete(validateOpjectId, verifyToken, deletePostCtrl)
     .put(validateOpjectId, verifyToken, updatePostCtrl)


// /api/posts/update-image/:id
router.route("/update-image/:id")
    .put(validateOpjectId, verifyToken, photoUpload.single("image"), updatePostImageCtrl)


// /api/posts/like/:id
router.route("/like/:id").put(validateOpjectId, verifyToken, toggleLikeCtrl)    

module.exports = router