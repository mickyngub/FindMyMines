import React, { useEffect, useState } from "react";
import "./App.css";
import Grids from "./Components/Grids";

import io from "socket.io-client";
const socket = io("http://localhost:8000");

function App() {
  const [value, setValue] = useState("");
  const [name, setName] = useState("");

  let onClickHandler = () => {
    socket.emit("chat message", "I hope this work");
  };

  let onSubmitHandler = (event) => {
    socket.emit("name-event", name);
    event.preventDefault();
  };

  let onChangeHandler = (e) => {
    setName(e.target.value);
  };
  useEffect(() => {
    socket.on("received-connection", (msg) => {
      setValue(msg);
    });
    socket.on("name-event-sendback", (yourName) => {
      setName(yourName + "sentback");
    });
  }, [name]);
  return (
    <div className="App" style={{ marginTop: "5vh" }}>
      Hey welcome to FindMyMines by Micky-Pinn-Boss
      <Grids></Grids>
      <ul id="messages"></ul>
      <div onClick={onClickHandler}>Send</div>
      <div>This is value {value}</div>
      <form onSubmit={onSubmitHandler}>
        <input onChange={onChangeHandler} type="text"></input>
        <button type="submit">Submit</button>
      </form>
      <div>This is your name {name}</div>
    </div>
  );
}

export default App;
