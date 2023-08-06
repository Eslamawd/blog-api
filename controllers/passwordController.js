const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs") 
const { User, validateEmail, validatePassword } = require("../models/User")
const Verification = require("../models/VerificationToken")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")




/**-------------------------------------------------
 * @desc  send reset password link
 * @router /api/password/reset-password-link
 * @method Post
 * @access public
 ------------------------------------------------*/

 module.exports.senReqestPasswordLink = asyncHandler(async (req, res) => {
    // validation
    const { error } = validateEmail(req.body);
    if (error) { 
        return res.status(400).json({ message: error.details[0].message });
    }
    // get user by db from email
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return res.status(404).json({message: "User with given email not found"});
    }
    // creating Verification
    let verificationToken = await Verification.findOne({ userId: user._id });

    if(!verificationToken) {
        verificationToken = new Verification.findOne({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        });
        await verificationToken.save();
    }
    // creating link
    
    const link = `${process.env.DOMEN_API}/reset-password/${user._id}/${verificationToken.token}/a`;
    // creating htmlTamplate
    const htmlTemplate = `
    <div>
    <p>Click on Link to reset password </p>
    <a href="${link}}">Verify</a>
    </div>
    `;
    // sending Email
    
    await sendEmail(user.email, "Reset password ", htmlTemplate);
    //response to the clint
    
    res.status(200).json({ message: "reset password to email please cheack on email " })
 });


 
/**-------------------------------------------------
 * @desc  get  reset password link
 * @router /api/password/reset-password/:userId/:token
 * @method GET
 * @access public
 ------------------------------------------------*/

 module.exports.getRequstPasswordCtrl = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.userId);

    if(!user) {
        return res.status(400).json({message: "invaled linkss"});
    }


    const verificationToken = await Verification.findOne({
        userId: user._id,
        token: req.params.token,
    });

    if(!verificationToken) {
        return res.status(400).json({ message: "invaled link" });
    }

     res.status(200).json({ message: "valid url" })

 }); 


 

 
/**-------------------------------------------------
 * @desc   reset password 
 * @router /api/password/reset-password-link/:userId/:token
 * @method POST
 * @access public
 ------------------------------------------------*/

 module.exports.resetPasswordCtrl = asyncHandler(async (req, res) => {

    const { error } = validatePassword(req.body);
    if (error) { 
        return res.status(400).json({ message: error.details[0].message });
    }

    const user = User.findById(req.params.userId);
    if(!user) {
        return res.status(400).json({ message: "not user email exist!" })
    }

    const verificationToken = await Verification.findOne({
        userId: user._id,
        token: req.params.token,
    });
    if(!verificationToken) {
        return res.status(400).json({ message: "not user  exist!" });
    }

    if(!user.isAccountVerified) {
        user.isAccountVerified = true;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;
    await user.save();
    await verificationToken.remove();

    res.status(200).json({ message: "password reset successfully"});

    

 });