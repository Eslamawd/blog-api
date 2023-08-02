const mongoose = require("mongoose")
const joi = require("joi")


// ###### comment schema ######## \\

const CommentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlingth: 400
    },
    
    username: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

// comment model 
const Comment = mongoose.model("Comment", CommentSchema)


/////// Validate \\\\\\

function validateCreateComment(obj) {
    const schema = joi.object({
        postId: joi.string().required(),
        text: joi.string().max(400).required().trim(),
    })
    return schema.validate(obj)
}


/////// Validate update \\\\\\

function validateUpdateComment(obj) {
    const schema = joi.object({
        text: joi.string().max(400).required().trim(),
    })
    return schema.validate(obj)
}


module.exports = {
    Comment,
    validateCreateComment,
    validateUpdateComment,
}