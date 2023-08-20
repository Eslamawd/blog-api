const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const Joi = require('joi')
const passwordComplexity = require("joi-password-complexity")


// user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trm: true,
        minlength: 4,
        maxlength: 40,

    },
    email: {
        type: String,
        required: true,
        trm: true,
        minlength: 5,
        maxlength: 50,
        unique: true

    },
    password: {
        type: String,
        required: true,
        trm: true,
        minlength: 8,
       

    },
    profilePhoto: {
        type: Object,
        default: {
            url: "",
            publicId: null,
        }

    },
    bio: {
       type: String
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    sendRequist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        }
    ],

    requestFrinds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        }
    ],
    frinds: 
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        }
    ],


}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// populate posts that belongs to this user when he/she get his/her profile
UserSchema.virtual("posts", {
    ref: "Post",
    foreignField: "user",
    localField: "_id",
})
UserSchema.virtual("requist", {
    ref: "User",
    foreignField: "_id",
    localField: "requestFrinds",
})
UserSchema.virtual("frind", {
    ref: "User",
    foreignField: "_id",
    localField: "frinds",
})

// genrate Auth Token 
UserSchema.methods.generateAuthToken = function() {
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.ACCESS_TOKEN_SECRET)

}


const User = mongoose.model("User", UserSchema)

// validate Register User
function validateRegisterUser(obj) {
    const Schema = Joi.object({
        username: Joi.string().trim().min(4).max(40).required(),
        email: Joi.string().trim().min(4).max(40).required().email(),
        password: Joi.string().trim().min(8).max(15).required(),
    })
    return Schema.validate(obj)
}

// validate login User
function validateLoginUser(obj) {
    const Schema = Joi.object({
        email: Joi.string().trim().min(4).max(40).required().email(),
        password: Joi.string().trim().min(8).required(),
    })
    return Schema.validate(obj)
}
// validate Update User
function validateUpdateUser(obj) {
    const Schema = Joi.object({
        username: Joi.string().trim().min(4).max(40).required(),
        password: Joi.string().trim().max(15).min(8),
        bio: Joi.string().max(77)
    })
    return Schema.validate(obj)
}

// validate Email
function validateEmail(obj) {
    const Schema = Joi.object({
        email: Joi.string().trim().min(4).max(40).required().email()
    })
    return Schema.validate(obj)
}

// validate password
function validatePassword(obj) {
    const Schema = Joi.object({
        password:  Joi.string().trim().min(8).max(15).required(),
    })
    return Schema.validate(obj)
}

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
    validateEmail,
    validatePassword
}