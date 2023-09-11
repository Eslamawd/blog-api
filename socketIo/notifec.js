module.exports = socket => {
    socket.on('roomNotfications', id => {
            socket.join(id)
    })
}