const { sendNewMessage } = require("../controllers/chatsController")

module.exports = (socket, io) => {
    socket.on('newConnectChat', chatId => {
            socket.join(chatId)
    })
    
    socket.on('sendNewMessage', data => {
        sendNewMessage(data).then(
            io.to(data.chatId).emit('newMessage', {
                chatId: data.chatId,
                sender: data.sender,
                content: data.content
    
            })
        )
        
    })
}