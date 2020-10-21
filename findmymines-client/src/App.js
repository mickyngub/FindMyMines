import React, { useEffect, useState } from "react";
import "./App.css";
import Grids from "./Components/Grids";

import io from "socket.io-client";

function App() {
  const [value, setValue] = useState("");
  const socket = io("http://localhost:8000");

  let onClickHandler = () => {
    socket.emit("chat message", "I hope this work");
  };

  useEffect(() => {
    socket.on("received-connection", (msg) => {
      setValue(msg);
    });
  }, []);
  return (
    <div className="App" style={{ marginTop: "5vh" }}>
      Hey welcome to FindMyMines by Micky-Pinn-Boss
      <Grids></Grids>
      <ul id="messages"></ul>
      <div onClick={onClickHandler}>Send</div>
      <div>This is value {value}</div>
    </div>
  );
}

export default App;
