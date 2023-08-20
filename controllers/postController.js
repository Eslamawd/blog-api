const fs = require("fs")
const path = require("path")
const asyncHandler = require("express-async-handler")
const { Post, validateCreatePost, validateUpdatePost} = require("../models/Post")
const { cloudinaryUploadImage, cloudinaryRemoveImage} = require("../utils/cloudinary")
const {Comment } = require("../models/Comment")





/**-------------------------------------------------
 * @desc Create New user
 * @router /api/posts
 * @method POST
 * @access private (only logged in)
 ------------------------------------------------*/

module.exports.createPostCtrl = asyncHandler(async (req, res) => {
    //validatin for image
    if(!req.file) {
        return res.status(400).json({ message: " no image provided"})
    }


    //validatin for data
    const { error } = validateCreatePost(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }


    //upload photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinaryUploadImage(imagePath)
    
    
    //create new post and save it to db
    const post = await Post.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        user: req.user.id,
        image: {
            url: result.secure_url,
            publicId: result.public_id,
        }
    })


    //send response to the client
    res.status(201).json(post)
    //remove image from the server
     fs.unlinkSync(imagePath)
})





/**-------------------------------------------------
 * @desc get all posts
 * @router /api/posts
 * @method GET
 * @access public 
 ------------------------------------------------*/
 module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
   const POST_PAGE = 3
   const { pageNumber, category } = req.query
   let posts;

   if(pageNumber) {
   posts = await Post.find()
   .skip((pageNumber - 1) * POST_PAGE) 
   .limit(POST_PAGE)
   .sort({ createdAt: -1})
   .populate("user", ["-password"]);
   } else if (category) {
    posts = await Post.find({ category })
                .sort({ createdAt: -1})
                .populate("user", ["-password"]);
   } else {
    posts = await Post.find().sort({ createdAt: -1 })
                .populate("user", ["-password"])
   }

   res.status(200).json(posts)


 })




/**-------------------------------------------------
 * @desc get sengle post
 * @router /api/posts/:id
 * @method GET
 * @access public 
 ------------------------------------------------*/
 module.exports.getSenglePostCtrl = asyncHandler(async (req, res) => {
   const post = await Post.findById(req.params.id)
   .populate("user", ["-password"])
   .populate("comments")
   if(!post) {
    return res.status(404).json({ message: 'post not found'})
   }


   res.status(200).json(post)


 })




/**-------------------------------------------------
 * @desc get posts count
 * @router /api/posts/count
 * @method GET
 * @access public 
 ------------------------------------------------*/
 module.exports.getPostCountCtrl = asyncHandler(async (req, res) => {
   const count = await Post.count()
   if(!count) {
    return res.status(404).json({ message: 'post not found'})
   }


   res.status(200).json(count)


 })


 

/**-------------------------------------------------
 * @desc delete post 
 * @router /api/posts/:id
 * @method DELETE
 * @access private (only admin , only user) 
 ------------------------------------------------*/
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({ message: "post not found"})
    }

    if (req.user.isAdmin || req.user.id === post.user.toString()) {
        await Post.findByIdAndDelete(req.params.id)
        await cloudinaryRemoveImage(post.image.publicId)
        // coment '''''
       await  Comment.deleteMany({postId: post._id})

        res.status(200).json({ message: "post has been deleted successfully", postId: post._id})
    } else {
        res.status(401).json({message: " not access please not try agin "})
    }

})




/**-------------------------------------------------
 * @desc update post Image 
 * @router /api/posts/upload-image/:id
 * @method PUT
 * @access private ( only user) 
 ------------------------------------------------*/

 module.exports.updatePostImageCtrl = asyncHandler( async (req, res) => {
    // validation
    if (!req.file) {
        return res.status(400).json({ message: " not photo pleace select photo"})
    }

    // get the post from db and check
    const post = await Post.findById(req.params.id)
    if(!post) {
        res.status(404).json({ message: "post not found"})
    }

    // check if this post  belong to logged in user
    if(req.user.id !== post.user.toString()) {
      return  res.status(403).json({message: "not log in"})
    }

    // update post image
    await cloudinaryRemoveImage(post.image.publicId)

    // upload new photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinaryUploadImage(imagePath)

     // update post 
     const updateImage = await Post.findByIdAndUpdate(req.params.id, {
        $set: {
            image: {
                url: result.secure_url,
                publicId: result.public_id,
            }
        }
    }, { new: true })

    // send respose to clint
    res.status(200).json(updateImage)

    // deleted photo on the server
    fs.unlinkSync(imagePath)
 })




/**-------------------------------------------------
 * @desc update post 
 * @router /api/posts/:id
 * @method PUT
 * @access private ( only user) 
 ------------------------------------------------*/

 module.exports.updatePostCtrl = asyncHandler( async (req, res) => {
    // validation
    const { error } = validateUpdatePost(req.body)

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    // get the post from db and check
    const post = await Post.findById(req.params.id)
    if(!post) {
        res.status(404).json({ message: "post not found"})
    }

    // check if this post  belong to logged in user
    if(req.user.id !== post.user.toString()) {
      return  res.status(403).json({message: "please not log in"})
    }

    // update post 
    const updatePost = await Post.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category
        }
    }, { new: true }).populate("user", ["-password"])

    // send respose to clint
    res.status(200).json(updatePost)
 })



 

/**-------------------------------------------------
 * @desc toggle like post 
 * @router /api/posts/like/:id
 * @method PUT
 * @access private ( only user loged in) 
 ------------------------------------------------*/

 module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {

    const loggedInUser = req.user.id
    const { id: postId } = req.params

    let post = await Post.findById(postId)
    if (!post) {
        return res.status(404).json({ message: "post not found"})
    }

    const isPostLiked = post.likes.find((user) => user.toString() === loggedInUser)

    if (isPostLiked) {
        post = await Post.findByIdAndUpdate(postId, {
            $pull: {
                likes: loggedInUser,
            }
        }, {
            new: true
        })
    } else {
        post = await Post.findByIdAndUpdate(postId, {
            $push: {
                likes: loggedInUser,
            }
        }, {
            new: true
        })
    }
    res.status(200).json(post);
 })
