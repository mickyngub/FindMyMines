const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user has connected");
  socket.on("chat message", (msg) => {
    console.log("this is chat " + msg);
  });
});

http.listen(8000, () => {
  console.log("listening on port 8000");
});
