const mongoose = require("mongoose")

// post Schema

const ChatSchema = new mongoose.Schema({
    userInChat: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        },
    ]
    
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

/////// populite comment for thes post \\\\\\\

ChatSchema.virtual("userChats", {
    ref: "User",
    foreignField: "_id",
    localField: "userInChat",
})



const Chat = mongoose.model("Chat", ChatSchema)



module.exports = {
    Chat
}