const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let userConnectedArray = [];
io.on("connection", (socket) => {
  io.emit("received-connection", "YOU are connected to the server");
  console.log("a user has connected");

  socket.on("name-of-player", (name) => {
    userConnectedArray.push({ name, id: socket.id });
    console.log("The user has connected the name is", name);
    console.log("its socket id is", socket.id);
    io.emit("name-of-users-connected", userConnectedArray);
  });

  console.log(socket.client.conn.server.clientsCount + " users connected");

  socket.on("bombLocation", (bombLocation) => {
    console.log("test game successful");
    socket.broadcast.emit("bombFromServer", bombLocation);
  });

  socket.on("disconnect", () => {
    console.log("what is this", socket.id);
    console.log("a user disconnect");
    userConnectedArray = userConnectedArray.filter((obj) => {
      obj.id !== socket.id;
    });
    console.log(Object.keys(socket.rooms));
  });
});

http.listen(8000, () => {
  console.log("listening on port 8000");
});
