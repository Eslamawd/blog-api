module.exports = (socket, io) => {
    socket.on('roomNotfications', id => {
            socket.join(id)
    })
    socket.on('goOnline', id => {
        io.onlineUser[id] = true
        socket.on('disconnect', () => {
            io.onlineUser[id] = false
        })
    })
}