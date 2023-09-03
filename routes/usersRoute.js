const router = require("express").Router()
const { getAllUsersCtrl, getAllUserProfileCtrl, updateUserProfileCtrl, getUserCountCtrl, profilePhotoUploadCtrl, deleteUserProfileCtrl } = require("../controllers/userController")
const { virfyTokenAndAdmin, virfyTokenAndOnlyUser, verifyToken, virfyTokenAndAthorization } = require("../middlewares/virfyToken")
const validateOpjectId = require("../middlewares/validateOpjectId")
const photoUpload = require("../middlewares/photoUpload")
const { getAllUsersRequests, addNewRequest, getAllUsersFrends, addNewFrind, deleteRequist } = require("../controllers/frindsController")

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

// api/users/requist
router.route("/requist")
            .get(verifyToken, getAllUsersRequests)

router.route("/requist/:id")
            .put(validateOpjectId , verifyToken, addNewRequest)

// api/users/frinds
router.route("/frinds")
            .get(verifyToken, getAllUsersFrends)


router.route("/frinds/:id")
        .put(verifyToken, addNewFrind)
        .delete(verifyToken, deleteRequist)
            


module.exports = router