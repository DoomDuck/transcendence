// import BallServer from './BallServer'
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const BallServer = require('./BallServer.js')

app.use('/', express.static(__dirname + '/'))

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

var connected_clients = new Array();
var client_sockets = new Map();
var game = {
  p1: null,
  p2: null,
  playing: false,
};

function connect(socket) {
  console.log(`user ${socket.id} has connected`);
  connected_clients.push(socket.id);
  client_sockets.set(socket.id, socket);
  if (!game.playing && connected_clients.length >= 2) {
    game.playing = true;
    game.p1 = connected_clients.shift();
    game.p2 = connected_clients.shift();
    start_game(game);
  }
}

function start_game(game) {
  console.log('GAME STARTED');
  // console.log('--- --- ---');
  const socket1 = client_sockets.get(game.p1);
  const socket2 = client_sockets.get(game.p2);
  socket1.emit('p1');
  socket2.emit('p2');
  // socket1.emit('barUpdate', 2, 0);
  // socket2.emit('barUpdate', 1, 0);
  ball = new BallServer(.5, .5, .1, .1)
  var lastNow = Date.now();
  var now, elapsed;
  setInterval(function () {
    now = Date.now();
    elapsed = now - lastNow;
    lastNow = now
    ball.update(elapsed)
    ball.send(socket1, socket2);
  }, 50)
}

function disconnect(socket) {
  console.log(`user ${socket.id} has disconnected`);
  if (game.playing && !connected_clients.includes(socket.id)) {
    const socket1 = client_sockets.get(game.p1);
    const socket2 = client_sockets.get(game.p2);
    if (socket.id == game.p1) {
      connected_clients.push(game.p2);
      socket2.emit('gameEnd');
    }
    else if (socket.id == game.p2) {
      connected_clients.push(game.p1);
      socket1.emit('gameEnd');
    }
    game.playing = false;
  }
  else {
    const clientIndex = connected_clients.indexOf(socket.id);
    connected_clients.splice(clientIndex, 1);
  }
  client_sockets.delete(socket.id);
}

function barUpdateFromClient(n, y) {
  console.log('received barUpdate');
  const socket1 = client_sockets.get(game.p1);
  const socket2 = client_sockets.get(game.p2);
  if (n == 1) {
    socket2.emit('barUpdateFromServer', n, y);
  }
  else if (n == 1) {
    socket1.emit('barUpdateFromServer', n, y);
  }
  client_sockets.forEach((socket) => {
    socket.emit('barUpdateFromServer', n, y);
  })
}

io.on('connection', (socket) => {
  // console.log(`user ${socket.id} has connected`);
  // socket.on('hello', (...args) => {
  //   console.log(args);
  // });
  connect(socket);
  socket.on('disconnect', () => disconnect(socket));
  socket.on('barUpdateFromClient', barUpdateFromClient)
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

// io.on('hello', (...args) => {
//   console.log(args);
// })
