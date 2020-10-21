import React from "react";
import "./App.css";
import Grids from "./Components/Grids";

import io from "socket.io-client";

function App() {
  const socket = io("https://localhost:8000");

  let onClickHandler = () => {
    socket.emit("chat message", "I hope this work");
  };

  return (
    <div className="App" style={{ marginTop: "5vh" }}>
      Hey welcome to FindMyMines by Micky-Pinn-Boss
      <Grids></Grids>
      <ul id="messages"></ul>
      <div onClick={onClickHandler}>Send</div>
    </div>
  );
}

export default App;
