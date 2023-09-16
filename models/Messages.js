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
           type: Number,
           default: Date.now()
    }
    
    
    
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

/////// populite comment for thes post \\\\\\\

MessagesSchema.virtual("userMessage", {
    ref: "Chat",
    foreignField: "_id",
    localField: "chatId"
    
})



const Message = mongoose.model("Message", MessagesSchema)



module.exports = {
    Message
}