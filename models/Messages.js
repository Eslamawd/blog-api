const mongoose = require("mongoose")

// post Schema

const MessagesSchema = new mongoose.Schema({
    chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",

        },
   content:{ 
            type: String,
            required: true
       },
    sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        },
    timestamps: {
           type: String,
           default: new Date.now()
    }
    
    
    
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

/////// populite comment for thes post \\\\\\\

MessagesSchema.virtual("userChats", {
    ref: "User",
    foreignField: "_id",
    localField: "userInChat",
})



const Chats = mongoose.model("Chats", MessagesSchema)



module.exports = {
    Chats
}