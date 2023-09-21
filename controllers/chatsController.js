const asyncHandler = require("express-async-handler")
const { Chat } = require("../models/Chat")
const { Message } = require("../models/Messages")
const { User } = require("../models/User")

function getMessagOnProfile (user, frind) {
let chat =  Chat.findOne({
    userInChat: {
                $all: [user, frind]
    }
}).populate('userInChat', ['profilePhoto username'])
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

module.exports.sendNewMessage = async(data) => {
    try {


        const message =  new Message({
            chatId: data.chatId,
            content: data.content,
            sender: data.sender,
            timestamps: Date.now,
        })

        message.save
        
                
        
    } catch (error) {
        throw new Error(error)
        
    }
 }



module.exports.getChat = asyncHandler(async(req, res) => {

    let chat =  await Chat.findOne({
        userInChat: {
                    $all: [ req.user.id, req.params.id ]
        }
    }).populate({   
        path: 'userInChat',
        model: 'User',
        select: 'username profilePhoto'
     })

    const message = await Message.find({
         chatId: chat._id,
     })

    if(!message) {
            res.status(200).json(chat)
        }
        else if (message) {
                res.status(200).json({ chat, message })
        } else {
          return res.status(404).json({message: "not found"})
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
    if(chats) {
        res.status(200).json(chats)
    } else {
        return res.status(404).json({message: "not found"})
    }
} catch (error) {
    throw new Error(error)
    
}
})