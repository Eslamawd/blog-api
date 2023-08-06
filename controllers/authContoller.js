const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs") 
const { User, validateRegisterUser, validateLoginUser } = require("../models/User")
const Verification = require("../models/VerificationToken")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")




/**-------------------------------------------------
 * @desc Register new user \/ Sing Up
 * @router /api/auth/register
 * @method Post
 * @access public
 ------------------------------------------------*/


 module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
    // validation
    const { error } = validateRegisterUser(req.body);

     if (error) {
        return res.status(400).json({ message: error.details[0].message })

     }
    // is user already exists

    let user =  await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).json({ message: "user already exists" })
    }
    // hash the password

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    // new user and save it to db

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    })

    await user.save()
    //creating new token 
    const verifyctionToken = new Verification({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
    })
    await verifyctionToken.save();

    const link = `${process.env.DOMEN_API}/users/${user._id}/verify/${verifyctionToken.token}/a`;

    const htmlTemplate = `
    <div>
    <p>Click on Link to Verify </p>
    <a href="${link}}">Verify</a>
    </div>
    `;

     // sending email (verify email) 

     await sendEmail(user.email, "Verify Your Email", htmlTemplate)



    // send response to client

    res
       .status(200)
       .json({message: `create new user please verify we sent to ${user.email}`})
 })




 
/**-------------------------------------------------
 * @desc Login User
 * @router /api/auth/login
 * @method Post
 * @access public
 ------------------------------------------------*/


module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
    //vaidation
    const { error } = validateLoginUser(req.body)

    if (error) {
       return res.status(400).json({ message: error.details[0].message })

    }
    // is user exist
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ message: "invalid email or password"})
    }

    // check the password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "invalid password"})
    }

    // sending email (verify email )
    if(!user.isAccountVerified) {
        let verificationToken = await Verification.findOne({
            userId: user._id
        })
        if(!verificationToken) {
           verificationToken = new Verification.findOne({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            })
            await verificationToken.save()
           
        }
        const link = `${process.env.DOMEN_API}/users/${user._id}/verify/${verificationToken.token}/a`

        const htmlTemplate = `
        <div>
        <p>Click on Link to Verify </p>
        <a href="${link}}">Verify</a>
        </div>
        `
        
        await sendEmail(user.email, "Verify Your Email", htmlTemplate)
        return res
        .status(400)
        .json({message: ` please verify we sent to ${user.email}`})
    }


    // genarate token jwt
    const token = user.generateAuthToken()


    // response to clint

    res.status(200).json({
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
        token
    });
});




/**-------------------------------------------------
 * @desc verify User account
 * @router /api/auth/:userId/verify/:token
 * @method get
 * @access public
 ------------------------------------------------*/


 module.exports.verifyUserAccountCtrl = asyncHandler(async (req, res ) => {

    const user = await User.findById(req.params.userId);
    if(!user) {
        return res.status(400).json({ message: "invaledlink" });
    }

    let tokenVerify = await Verification.findOne({
        userId: user._id,
        token: req.params.token,
    });

    if(!tokenVerify) {
        return res.status(400).json({ message: "invaledlink" });
    }

    user.isAccountVerified = true;

    await user.save();

    await tokenVerify.remove();
    
    res.status(200).json({ message: "Your account verified "});
 });


