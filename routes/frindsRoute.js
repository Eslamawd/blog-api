const router = require("express").Router()
const validateOpjectId = require("../middlewares/validateOpjectId")

const { getAllUsersRequests, addNewRequest, getAllUsersFrends, addNewFrind, deleteRequist } = require("../controllers/frindsController")
const  { virfyTokenAndNotUser, verifyToken }  = require("../middlewares/virfyToken")




// api/users/requist
router.route("/requi")
            .get(verifyToken, getAllUsersRequests)

router.route("/requi/:id").put(validateOpjectId, virfyTokenAndNotUser, addNewRequest)

// api/users/frinds
router.route("/frinds")
            .get(verifyToken, getAllUsersFrends)


router.route("/frinds/:id")
        .put(verifyToken, addNewFrind)
        .delete(verifyToken, deleteRequist)
            


module.exports = router