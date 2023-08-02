const mongoose = require("mongoose")
const joi = require("joi")


// ###### category schema ######## \\

const CategorySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    }

}, {
    timestamps: true,
})

// category model 
const Category = mongoose.model("Category", CategorySchema)


/////// Validate \\\\\\

function validateCreateCategory(obj) {
    const schema = joi.object({
        title: joi.string().max(40).required().trim(),
    })
    return schema.validate(obj)
}




module.exports = {
    Category,
    validateCreateCategory
}