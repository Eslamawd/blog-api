module.exports = (socket, io) => {
    socket.on('sendFrindRequist', data => {
        io.to(data.userId).emit('newFrindRequist', {
            id: data.id,
            profilePhoto: data.profilePhoto,
            username: data.username

        })
    })

}