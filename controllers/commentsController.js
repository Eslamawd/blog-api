const asyncHandler = require("express-async-handler")
const { Comment, validateCreateComment, validateUpdateComment } = require("../models/Comment")
const { User } = require("../models/User")





/**-------------------------------------------------
 * @desc Create New comment
 * @router /api/comments
 * @method POST
 * @access private (only logged in)
 ------------------------------------------------*/
  module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
    const { error } = validateCreateComment(req.body)
    if (error) {
        
        return res.status(400).json({message: error.details[0].message})
    }
    const profile = await User.findById(req.user.id)
    const comment = await Comment.create({
        postId: req.body.postId,
        text: req.body.text,
        user: req.user.id,
        username: profile.username,
    })

    res.status(201).json(comment)
  })




  
/**-------------------------------------------------
 * @desc Get all comments
 * @router /api/comments
 * @method Get
 * @access private (only Admin)
 ------------------------------------------------*/

 module.exports.getAllCommentsAdmin = asyncHandler(async (req, res) => {
    const comments = await Comment.find().populate("user", ["-password"])

    res.status(200).json(comments)
  })
  
  



  
/**-------------------------------------------------
 * @desc delete Comment
 * @router /api/comments/:id
 * @method DELETE
 * @access private (only Admin, user)
 ------------------------------------------------*/

 module.exports.deleteCommentsCtrl = asyncHandler(async (req, res) => {
  
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
        return res.status(404).json({message: " comment not found " })
    }

    if (req.user.isAdmin || req.user.id === comment.user.toString()) {
        await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "comment deleted succss"})
    }else {
     
        res.status(403).json({ message: "not allowed"})   
    }
  })
  



  
/**-------------------------------------------------
 * @desc update Comment
 * @router /api/comments/:id
 * @method PUT
 * @access private (only user)
 ------------------------------------------------*/

 module.exports.updateCommentsCtrl = asyncHandler(async (req, res) => {
    const { error } = validateUpdateComment(req.body)
    if (error) {
        
        return res.status(400).json({message: error.details[0].message})
    }

    const comment = await Comment.findById(req.params.id)
    if(!comment) {
        return res.status(404).json({ message: "comment not  found"})
    }
    if(req.user.id !== comment.user.toString()) {
        return res.status(403).json({message: 'not access '})
    } 

    const updateComment = await Comment.findByIdAndUpdate(req.params.id, {
        $set: {
            text: req.body.text,
        }
    }, { new: true})

    res.status(200).json(updateComment)
  })
  
  
