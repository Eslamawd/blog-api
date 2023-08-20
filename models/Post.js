const mongoose = require("mongoose")
const joi = require("joi")

// post Schema

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlingth: 2,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlingth: 10,
        maxlength: 600,
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        minlingth: 4,
        maxlength: 40,
    },
    image: {
        type: Object,
        default: {
            url: "",
            publicId: null,
        }
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        }
    ]
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

/////// populite comment for thes post \\\\\\\

PostSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "postId",
    localField: "_id",
})



const Post = mongoose.model("Post", PostSchema)



//validate create Post

function validateCreatePost(obj) {
    const schema = joi.object({
        title: joi.string().trim().min(2).max(200),
        description: joi.string().trim().min(10).max(600),
        category: joi.string().trim().min(4).max(40),

    })

    return schema.validate(obj)
}

//validate create Post

function validateUpdatePost(obj) {
    const schema = joi.object({
        title: joi.string().trim().min(2).max(200),
        description: joi.string().trim().min(10).max(600),
        category: joi.string().trim().min(4).max(40),

    })

    return schema.validate(obj)
}



module.exports = {
    Post,
    validateCreatePost,
    validateUpdatePost
}