const express = require("express")
const router = express.Router()
const { senReqestPasswordLink, getRequstPasswordCtrl, resetPasswordCtrl } = require("../controllers/passwordController")


// api/password/reset-password-link

router.post("/reset-password-link", senReqestPasswordLink)

// api/password/reset-password/:userId/:token

router.route("/reset-password/:userId/:token")
        .get(getRequstPasswordCtrl)
        .post(resetPasswordCtrl)





module.exports = router;