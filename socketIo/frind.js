const { getOnlineFrinds } = require("../controllers/frindsController")

module.exports = (socket, io) => {
    socket.on('sendFrindRequist', data => {
        io.to(data.userId).emit('newFrindRequist', {
            id: data.id,
            profilePhoto: data.profilePhoto,
            username: data.username

        })
    })
    socket.on('getOnlineUser', id => {
        getOnlineFrinds(id).then(frinds => {
            let onlineUsers = frinds.filter(frind => io.onlineUser[frind._id])
            io.to(id).socket.emit('onlineFrinds', onlineUsers)
        })
    })

}