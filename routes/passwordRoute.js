const express = require("express")
const router = express.Router()
const { senReqestPasswordLink, getRequstPasswordCtrl, resetPasswordCtrl } = require("../controllers/passwordController")
const valdiateOpjectUserId = require("../middlewares/valdiateOpjectUserId")


// api/password/reset-password-link

router.post("/reset-password-link", senReqestPasswordLink)

// api/password/reset-password/:userId/:token

router.route("/reset-password/:userId/:token")
        .get(valdiateOpjectUserId, getRequstPasswordCtrl)
        .post(valdiateOpjectUserId, resetPasswordCtrl)





module.exports = router