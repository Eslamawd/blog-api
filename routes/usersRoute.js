const router = require("express").Router()
const { getAllUsersCtrl, getAllUserProfileCtrl, updateUserProfileCtrl, getUserCountCtrl, profilePhotoUploadCtrl, deleteUserProfileCtrl } = require("../controllers/userController")
const { virfyTokenAndAdmin, virfyTokenAndOnlyUser, verifyToken, virfyTokenAndAthorization } = require("../middlewares/virfyToken")
const validateOpjectId = require("../middlewares/validateOpjectId")
const photoUpload = require("../middlewares/photoUpload")
// api/users/profile
router.route("/profile")
            .get(virfyTokenAndAdmin ,getAllUsersCtrl)

// api/users/profile/:id
router.route("/profile/:id")
            .get(validateOpjectId ,getAllUserProfileCtrl)
            .put(validateOpjectId, virfyTokenAndOnlyUser, updateUserProfileCtrl)
            .delete(validateOpjectId, virfyTokenAndAthorization, deleteUserProfileCtrl)



// api/users/profile/profile-photo-upload
router.route("/profile/profile-photo-upload")
            .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl)



// api/users/profile
router.route("/count")
            .get(virfyTokenAndAdmin ,getUserCountCtrl)



module.exports = router