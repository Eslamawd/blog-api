const express = require("express");

const router = express.Router();

const { registerUserCtrl, loginUserCtrl, verifyUserAccountCtrl } = require("../controllers/authContoller");


// api/auth/register
router.route("/register")
        .post(registerUserCtrl)

// api/auth/login
router.post("/login", loginUserCtrl)

// api/auth/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserAccountCtrl)


module.exports = router