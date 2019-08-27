var app = require('express')();
var http = require('http').createServer(app)
const io = require('socket.io')();
let id = 0;
let jots = [];

io.on('connection', (socket) => {
  jots.forEach((jotData) => {
    socket.emit('new jot', jotData);
  })
  console.log('A user connected')
  socket.on('disconnect', () => { console.log('A user disconnected')})
  socket.on('new jot', (jotData) => { 
    jotData.id = id++;
    io.emit('new jot', jotData)
    jots.push(jotData);
   })
   socket.on('jot moved', (moveData) => {
     // Update the jot in our list
     for (let jot of jots) {
       if (jot.id == moveData.id) { // id is a string on moveData, but an int on our side
         jot.position = moveData.position;
         break;
       }
     }
     // Notify clients
     io.emit('jot moved', moveData);
   })
   socket.on('delete jot', (jotData) => {
     jots = jots.filter(jot => jot.id === jotData.id)
     io.emit('delete jot', jotData);
   });

});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);