const asyncHandler = require("express-async-handler")
const { User, validateUpdateUser } = require("../models/User")
const bcrypt = require("bcryptjs") 
const path = require("path")
const fs = require("fs")
const { cloudinaryUploadImage, cloudinaryRemoveImage, cloudinaryRemoveAllImage} = require("../utils/cloudinary")
const { Comment } = require("../models/Comment")
const { Post } = require("../models/Post")



/**-------------------------------------------------
 * @desc Get all users
 * @router /api/users/profile
 * @method GET
 * @access private (only admin)
 ------------------------------------------------*/
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password")
    res.status(200).json(users)

})




/**-------------------------------------------------
 * @desc Get user Profile
 * @router /api/users/profile/:id
 * @method GET
 * @access public
 ------------------------------------------------*/
module.exports.getAllUserProfileCtrl = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password").populate("posts")
   if(!user) {
    return res.status(404).json({ message: "user not found"})
   }

   res.status(200).json(user)

})






/**-------------------------------------------------
 * @desc Update user Profile
 * @router /api/users/profile/:id
 * @method PUT
 * @access private (only user himself)
 ------------------------------------------------*/

 module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    if (req.body.password)
    {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            username: req.body.username,
            password: req.body.password,
            bio: req.body.bio
        }
    }, { new: true }).select("-password")
    .populate("posts")

    res.status(200).json(updatedUser)
 })



 
/**-------------------------------------------------
 * @desc get Count user
 * @router /api/users/count
 * @method GET
 * @access private (only Admin)
 ------------------------------------------------*/


 module.exports.getUserCountCtrl = asyncHandler(async (req, res) => {
    const count = await User.count()
    res.status(200).json(count)
 })




 
/**-------------------------------------------------
 * @desc profile Photo
 * @router /api/users/profile/profile-photo-upload
 * @method POST
 * @access private (only user Login)
 ------------------------------------------------*/


 module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: "no file pleases uploded photo"})
    }

    //GET THE PATH TO IMAGE
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)


    //UPLOAD TO CLOUDINARY
    const result = await cloudinaryUploadImage(imagePath)

    //GET THE USER FROM DB
    const user = await User.findById(req.user.id)
    //DELETE THE OLD PROFILE PHOTO IF EXIST
    if (user.profilePhoto.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId)
    }

    //CHANGE The profile photo fild in the DB
    user.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id
    }

    await user.save()


    //send response to clint
    res.status(200).json({ 
        message: "your profile photo uploaded successfully",
        profilePhoto: {url: result.secure_url, publicId: result.public_id}
    })

    //remove image from the server

    fs.unlinkSync(imagePath)

 })





/**-------------------------------------------------
 * @desc delete user profile (account)
 * @router /api/users/profile/:id
 * @method DELETE
 * @access private (only Admin OF user)
 ------------------------------------------------*/

 module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
    //get user from Db
    const user = await User.findById(req.params.id)

    if (!user) {
        return res.status(400).json({ message: "user not found"})
    }
    //getAll post from db

    await Post.deleteMany({ user: user._id })
    await Comment.deleteMany({ user: user._id })
    //get the puplic id from posts
    const posts = await Post.find({ user: user._id})

    const paplicIds = posts?.map(((post) => post.image.puplicId))
    //dlete all posts image from cloudinary
    if(paplicIds?.length > 0) {
        await cloudinaryRemoveAllImage(paplicIds)
    }


    //delete the profile image 
    if(user.profilePhoto.puplicId !== null) {

        await cloudinaryRemoveImage(user.profilePhoto.publicId)
    }
    //delete user posts & comments
    //delete the user 
    await User.findByIdAndDelete(req.params.id)
    // send response
    res.status(200).json({message: "your profile has deleted"})

 })