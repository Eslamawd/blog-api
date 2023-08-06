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
router.get("/:userId/verify/:token", valdiateOpjectUserId, verifyUserAccountCtrl)


module.exports = router;