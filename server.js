const io = require('socket.io')();
const os = require('os')

const port = 8000;
io.on('connection', onConnect);

let rooms = []
let id = 0

function getRoomById(lookupId) {
  console.log(`getRoomsById lookupId ${typeof(lookupId)}`)
  let maybeFound = rooms.filter(({id}) => lookupId.toString() === id.toString())
  if (maybeFound.length === 1) {
    console.log('Found rooM')
    return maybeFound[0]
  }
  return {jots: []}
}

function getJotsById(id) {
  return getRoomById(id).jots
}

function onConnect(socket) {
  // Give the room list 
  socket.emit('room list', rooms)
  socket.on('create room', roomName => {
    if (rooms.filter(({name}) => name === roomName).length === 0) {
      rooms.push({name: roomName, id: id++, jots:[]})
      io.emit('room_list', rooms)
    }
  })

  socket.on('connect to', (id) => {
    Object.keys(socket.rooms).forEach(roomId => {
      console.log(`Disconnecting from ${roomId}`)
      if (!isNaN(roomId)) socket.leave(roomId);
    });
    socket.join(id)
    console.log(`Joining ${id}`)
    getJotsById(id).forEach(jotData => socket.emit('new jot', jotData))
  })

  socket.on('new jot', (jotData) => { 
    jotData.id = id++;
    //ghostJots.push(jotData);
    getRoomById(jotData.roomId).jots.push(jotData)
    console.log(`Jot created, all rooms: ${rooms}`)
    console.log(rooms)
    socket.emit('new jot', jotData)
   })

   socket.on('jot moved', (moveData) => {
     /*
     let beforeLength = ghostJots.length
     ghostJots = ghostJots.filter((jot) => jot.id !== moveData.id)
     if (ghostJots.length !== beforeLength) {
       io.emit("new jot", moveData);
       jots.push(moveData);
     }

     // Update the jot in our list
     for (let jot of jots) {
       if (jot.id === moveData.id) { 
         jot.position = moveData.position;
         break;
       }
     }
     */
     // Notify clients
     console.log(moveData)
     io.to(`${moveData.roomId}`).emit('jot moved', moveData);
   })
}

io.listen(port);
console.log('listening on port ', port);
/*
let id = 0;
let jots = [];
let ghostJots = [];

io.on('connection', (socket) => {
  socket.emit('connected')

  jots.forEach((jotData) => {
    socket.emit('new jot', jotData);
  })
  console.log('A user connected')
  socket.on('disconnect', () => { console.log('A user disconnected')})

  socket.on('new jot', (jotData) => { 
    jotData.id = id++;
    ghostJots.push(jotData);
    socket.emit('new jot', jotData)
   })

   socket.on('jot moved', (moveData) => {
     let beforeLength = ghostJots.length
     ghostJots = ghostJots.filter((jot) => jot.id !== moveData.id)
     if (ghostJots.length !== beforeLength) {
       io.emit("new jot", moveData);
       jots.push(moveData);
     }

     // Update the jot in our list
     for (let jot of jots) {
       if (jot.id === moveData.id) { 
         jot.position = moveData.position;
         break;
       }
     }
     // Notify clients
     io.emit('jot moved', moveData);
   })

   socket.on('delete jot', (jotData) => {
     jots = jots.filter(jot => jot.id !== jotData.id)
     io.emit('delete jot', jotData);
   });

   socket.on("delete all", () => {
     for (let jot of jots) {
       io.emit("delete jot", { id: jot.id });
     }
     jots = [];
   });

   socket.on("updateVotes", (voteData) => {
     for (let jot of jots) {
       if (jot.id === voteData.id) { 
         jot.votes = voteData.votes;
         break;
       }
     }
     io.emit("updateVotes", voteData)
   })

   socket.on("lock jot", ({id}) => {
     socket.broadcast.emit("lock jot", {id})
   })
});

let networkInterfaces = os.networkInterfaces();
console.log('Addresses: ')
for (const iface in networkInterfaces) {
  for (const thing of networkInterfaces[iface]) {
    console.log(thing.address);
  }
}

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
*/