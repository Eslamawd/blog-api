const { getChat, getAllChat } = require("../controllers/chatsController")
const { verifyToken } = require("../middlewares/virfyToken")

const router = require("express").Router()


router.route("/")
        .get(verifyToken, getAllChat)

router.route("/:id")
        .get(verifyToken, getChat)





module.exports = router