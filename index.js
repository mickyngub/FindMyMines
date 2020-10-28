const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const userConnectedArray = [];
io.on("connection", (socket) => {
  io.emit("received-connection", "YOU are connected to the server");
  console.log("a user has connected");
  socket.on("name-of-player", (name) => {
    userConnectedArray.push(name);
    console.log("The user has connected the name is", name);
    io.emit("name-of-users-connected", userConnectedArray);
  });
  console.log(socket.client.conn.server.clientsCount + " users connected");
  socket.on("name-event", (msg) => {
    console.log("Your name is ", msg);
    io.emit("name-event-sendback", msg);
  });
  socket.on("chat message", (msg) => {
    console.log("this is chat " + msg);
  });
});

http.listen(8000, () => {
  console.log("listening on port 8000");
});
