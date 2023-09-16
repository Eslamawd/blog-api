const asyncHandler = require("express-async-handler")
const { Chat } = require("../models/Chat")
const { Message } = require("../models/Messages")
const { User } = require("../models/User")

const getMessagOnProfile = async(user, frind) => {
let chat = await Chat.find({
    userInChat: [ user, frind ]
}).populate('userInChat', ['profilePhoto username'])
chat.userInChat.find(f => f._id != user)
return chat;
}

const  getMessags = async(user) => {
let chat = await Chat.find({ userInChat: user})
const message = await Message.find({ chatId: chat._id }, null, {timestamps: 1}).populate({
    path: 'chatId',
    populate: {
        path: 'userInChat',
        model: 'User',
        select: 'username profilePhoto'
    }
})
const allMessage = message[0].chatId.userInChat.find(frind => frind._id != user)
return allMessage;
}





module.exports.getChat = asyncHandler(async(req, res) => {
try {
    let user = req.user.id
    let frind = req.params.id
    const chat = getMessagOnProfile(user, frind)

    if(chat) {
       const message = await Message.find({
            chatId: chat._id,
        }).populate({
            path: 'chatId',
            populate: {
                path: 'userInChat',
                model: 'User',
                select: 'username profilePhoto',
            }
        })

        if(!message) {
            res.status(200).json(chat)
        }
        res.status(200).json(message)

    } else {
        return res.status(404).json({message: "not found"})
    }
} catch (error) {
    throw new Error(error)
    
}
})


module.exports.getAllChat = asyncHandler(async(req, res) => {
try {
    let chats = await User.findById(req.user.id).populate({
        path: 'chats',
        populate: {
            path: 'userInChat',
            model: 'User',
            select: 'username profilePhoto',
        }
    })
    chats.user

    if(chats) {
        res.status(200).json(chats)
    } else {
        return res.status(404).json({message: "not found"})
    }
} catch (error) {
    throw new Error(error)
    
}
})