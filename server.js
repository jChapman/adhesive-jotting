const io = require('socket.io')();
const os = require('os')

const port = 8000;
io.on('connection', onConnect);

let rooms = []
let id = 0

function getRoomById(lookupId) {
  let maybeFound = rooms.filter(({id}) => lookupId.toString() === id.toString())
  if (maybeFound.length === 1) {
    return maybeFound[0]
  }
  console.log(`Didn't find ${lookupId}, current rooms: ${rooms.map(room => room.id)}`)
  return {jots: []}
}

function getJotsById(id) {
  return getRoomById(id).jots
}

// Returns true if we removed a jot
function removeGhostJot(roomId, jotId) {
  const room = getRoomById(roomId)
  let removed = false
  room.ghostJots = room.ghostJots.filter(jot => {
    if (jot.id === jotId){
      room.jots.push(jot)
      removed = true
      return false
    }
    return true
  })
  //if (removed) console.log(`Removed ghost jot ${jotId}`)
  return removed
}


function onConnect(socket) {
  // Give the room list 
  socket.emit('room list', rooms)
  socket.on('create room', roomName => {
    if (rooms.filter(({name}) => name === roomName).length === 0) {
      rooms.push({name: roomName, id: id++, jotIdCount: 0, jots:[], ghostJots:[]})
      console.log(`Creating room ${roomName}`)
      io.emit('room list', rooms)
    }
  })

  socket.on('connect to', (id) => {
    for (let room of Object.keys(socket.rooms)) {
      socket.leave(room)
    }
    socket.join(id)
    getJotsById(id).forEach(jotData => socket.emit('create jot', jotData))
  })

  socket.on('new jot', (jotData) => { 
    const room = getRoomById(jotData.roomId)
    jotData.id = room.jotIdCount++
    room.ghostJots.push(jotData)
    socket.emit('create jot', jotData)
   })

   socket.on('jot moved', (moveData) => {
     if (removeGhostJot(moveData.roomId, moveData.id)) {
       io.to(`${moveData.roomId}`).emit('create jot', moveData)
       getRoomById(moveData.roomId).jots.push(moveData)
     }

     // Update the jot in our list
     for (let jot of getRoomById(moveData.roomId).jots) {
       if (jot.id === moveData.id) { 
         jot.position = moveData.position;
         break;
       }
     }

     // Notify clients
     io.to(`${moveData.roomId}`).emit('jot moved', moveData);
   })

   socket.on('delete jot', (jotData) => {
     const room = getRoomById(jotData.roomId)
     room.jots = room.jots.filter(jot => jot.id !== jotData.id)
     io.to(`${jotData.roomId}`).emit('delete jot', jotData);
   });

   socket.on("delete all", () => {
     const roomId = Object.keys(socket.rooms)[0]
     const room = getRoomById(roomId)
     for (let jot of room.jots) {
        io.to(`${roomId}`).emit("delete jot", { id: jot.id });
     }
     room.jots = [];
   });

   socket.on("updateVotes", (voteData) => {
     const room = getRoomById(voteData.roomId)
     for (let jot of room.jots) {
       if (jot.id === voteData.id) { 
         jot.votes = voteData.votes;
         break;
       }
     }
     io.to(`${voteData.roomId}`).emit("updateVotes", voteData)
   })

   socket.on("lock jot", ({id, roomId}) => {
     io.to(`${roomId}`).emit("lock jot", {id})
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