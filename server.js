var app = require('express')();
var http = require('http').createServer(app)
const io = require('socket.io')();
let id = 0;

io.on('connection', (socket) => {
  console.log('A user connected')
  socket.on('disconnect', () => { console.log('A user disconnected')})
  socket.on('new jot', (jotData) => { 
    jotData.id = id++;
    io.emit('new jot', jotData)
   })
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);