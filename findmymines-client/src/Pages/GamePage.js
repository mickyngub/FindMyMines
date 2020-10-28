import React, { useEffect, useState } from "react";
import Grids from "../Components/Grids";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const GamePage = ({ location }) => {
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
  console.log(location);
  return (
    <div>
      Hey welcome to FindMyMines by Micky-Pinn-Boss
      <h3>
        YOUR ARE
        {location.state.username} !!
      </h3>
      <Grids />
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
};

export default GamePage;
