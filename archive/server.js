// server.js
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 4001

io.on('connection', (socket) => {
  let pingcnt = 0

  socket.on('userConnection', (data) => {
    const res = {
      uuid: data,
      msg: 'a user has connected!!'
    }
    socket.emit('userConnected', res)
  })

  socket.on('customPing', (data) => {
    pingcnt += 1
    const pingReply = {
      pingcnt,
      id: data
    }
    socket.emit('pingReply', pingReply)
  })

  socket.on('connect', (data) => {
    console.log('A user connected!', data)
  })

  socket.on('disconnect', (data) => {
    console.log('A user disconnected', data)
  })
})

server.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
