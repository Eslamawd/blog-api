const { createCommentCtrl, getAllCommentsAdmin, deleteCommentsCtrl, updateCommentsCtrl } = require("../controllers/commentsController")
const validateOpjectId = require("../middlewares/validateOpjectId")
const { verifyToken, virfyTokenAndAdmin } = require("../middlewares/virfyToken")

const router = require("express").Router()


// ///// /api/comments
router.route("/")
    .post(verifyToken, createCommentCtrl)
    .get(virfyTokenAndAdmin, getAllCommentsAdmin)



////////  /api/comments/:id
router.route("/:id")
    .delete(validateOpjectId, verifyToken, deleteCommentsCtrl)
    .put(validateOpjectId, verifyToken, updateCommentsCtrl)

module.exports = router