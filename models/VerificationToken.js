const mongoose = require("mongoose")

// ###### verification token schema ######## \\

const VerificationSchema = new mongoose.Schema({
   
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

// verification model 
const Verification = mongoose.model("Verification", VerificationSchema)



module.exports = Verification
