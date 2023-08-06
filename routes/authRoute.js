const express = require("express");

const router = express.Router();

const { registerUserCtrl, loginUserCtrl, verifyUserAccountCtrl } = require("../controllers/authContoller");
const valdiateOpjectUserId = require("../middlewares/valdiateOpjectUserId");


// api/auth/register
router.route("/register")
        .post(registerUserCtrl)

// api/auth/login
router.post("/login", loginUserCtrl)

// api/auth/:userId/verify/:token
router.route("/:userId/verify/:token")
 .get(valdiateOpjectUserId, verifyUserAccountCtrl)


module.exports = router