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

  socket.on("plusScore", () => {
    socket.broadcast.emit("plusScoreFromServer");
  });
  socket.on("gameStart", (randomPlayerValue) => {
    socket.broadcast.emit("gameStartFromServer", randomPlayerValue);
    let timer = 9;
    const interval = setInterval(() => {
      if (timer == -1) {
        timer = 10;
      }

      io.emit("timerFromServer", timer);
      console.log("emit timer zero from server every second");

      console.log("this is timer value in server", timer);
      timer = timer - 1;
    }, 1000);

    return () => clearInterval(interval);
  });
  socket.on("gameEnd", () => {
    io.emit("gameEndFromServer");
  });
  // socket.on("bombIsClicked", (index) => {});

  // socket.on("timerZero", () => {
  //   socket.emit("timerZeroFromServer");
  // });
  socket.on("disconnect", () => {
    socket.emit("gameStart", "stopTimer");
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
