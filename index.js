const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let userConnectedArray = [];
var interval;
var numberBomb = 0;

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
  socket.on("deductScore", () => {
    socket.broadcast.emit("deductScoreFromServer");
  });
  socket.on("showBomb", () => {
    socket.broadcast.emit("deductNumBombFromServer");
  });
  socket.on("resetBomb", () => {
    socket.broadcast.emit("resetBombFromServer");
  });
  socket.on("gameStart", (randomPlayerValue) => {
    console.log(randomPlayerValue);
    socket.broadcast.emit("gameStartFromServer", randomPlayerValue);
    let timer = 9;
    let numberBomb = 6;
    interval = setInterval(() => {
      if (timer == -1) {
        timer = 10;
      }
      io.emit("timerFromServer", timer);
      // console.log("emit timer zero from server every second");
      // console.log("this is interval value", interval);
      // console.log("this is timer value in server", timer);
      timer = timer - 1;
      console.log(numberBomb);
    }, 1000);
    return () => clearInterval(interval);
  });
  socket.on("changeTurn", () => {
    clearInterval(interval);
    let timer = 9;
    io.emit("changeTurnFromServer");
    interval = setInterval(() => {
      if (timer == -1) {
        timer = 10;
      }
      io.emit("timerFromServer", timer);
      console.log("emit timer zero from server every second");
      console.log("this is interval value", interval);
      console.log("this is timer value in server", timer);
      timer = timer - 1;
    }, 1000);
    return () => clearInterval(interval);
  });
  socket.on("showBomb", () => {
    io.emit("");
  });
  socket.on("SetScoreBySurrender", () => {
    socket.broadcast.emit("SetScoreBySurrenderFromServer");
  });
  socket.on("gameEndBySurrender2", () => {
    socket.broadcast.emit("gameEndBySurrender2FromServer");
    clearInterval(interval);
  });
  socket.on("DoubleTime", () => {
    clearInterval(interval);
    let timer = 20;
    interval = setInterval(() => {
      if (timer == -1) {
        timer = 10;
        io.emit("changeTurnFromServer");
      }
      io.emit("timerFromServer2", timer);
      console.log("emit timer zero from server every second");
      console.log("this is interval value", interval);
      console.log("this is timer value in server (Double is activated)", timer);
      timer = timer - 1;
    }, 1000);
    return () => clearInterval(interval);
  });
  socket.on("Resume", (timer) => {
    clearInterval(interval);
    interval = setInterval(() => {
      if (timer == -1) {
        timer = 10;
        io.emit("changeTurnFromServer");
      }
      io.emit("timerFromServer2", timer);
      console.log("emit timer zero from server every second");
      console.log("this is interval value", interval);
      console.log("this is timer value in server (Pause is activated)", timer);
      timer = timer - 1;
    }, 1000);
    return () => clearInterval(interval);
  });
  socket.on("Pause", (timer) => {
    console.log("Game is paused!");
    io.emit("PauseFromServer", timer);
    clearInterval(interval);
  });
  socket.on("gameEnd", () => {
    io.emit("gameEndFromServer");
    clearInterval(interval);
  });
  socket.on("gameEndByTrophy", () => {
    socket.broadcast.emit("gameEndByTrophyFromServer");
    clearInterval(interval);
  });
  socket.on("SetScoreByTrophy", () => {
    socket.broadcast.emit("SetScoreByTrophyFromServer");
  });
  socket.on("gameReset", () => {
    clearInterval(interval);
    io.emit("gameStartFromServer2");
  });
  socket.on("disconnect", () => {
    // socket.emit("gameStart", "stopTimer");
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
