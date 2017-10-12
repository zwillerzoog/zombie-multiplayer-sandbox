const express = require('express'); // Express contains some boilerplate to for routing and such
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http); // Here's where we include socket.io as a node module

// Serve the index page
// app.get("/", function (request, response) {
//   response.sendFile(__dirname + '/index.html');
// });

// Serve the assets directory
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

// Listen on port 5000
app.set('port', process.env.PORT || 3000);
http.listen(app.get('port'), function() {
  console.log('listening on port', app.get('port'));
});

let zombies = {};

io.on('connection', function(socket) {

    socket.on('new-zombie', function(state) {
        // console.log('New player joined with state:', state);
        zombies[socket.id] = state;
        // console.log('zombies[socket.id]', zombies[socket.id]);
        let socketID = socket.id;
        let firstID = Object.keys(io.sockets.connected)[0]
        // Broadcast a signal to everyone containing the updated zombies list
        io.emit('update-zombies', zombies);
        // io.emit('find-a-zombie', {socketID, firstID})
      });

      socket.on('move-zombie', function(position_data) {
        if (zombies[socket.id] == undefined) {
            console.log('happy birthday')
            return}; // Happens if the server restarts and a client is still connected
        console.log('zombies[socket.id]', zombies[socket.id]);
        zombies[socket.id].x = position_data.x;
        zombies[socket.id].y = position_data.y;
        zombies[socket.id].angle = position_data.angle;
        io.emit('update-zombies', zombies);
      });
})