import React, { useEffect, useState } from "react";
import Grids from "../Components/Grids";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const GamePage = ({ location }) => {
  let namesOfConnectedUserFromServer = [];
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [nameFromServer, setNameFromServer] = useState([]);
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
    socket.on("name-of-users-connected", (nameObj) => {
      namesOfConnectedUserFromServer = [...nameObj];
      setNameFromServer([...nameObj]);
      console.log(nameObj);
    });
    if (nameFromServer.indexOf(location.state.username) == -1) {
      socket.emit("name-of-player", location.state.username);
    }
  }, []);
  return (
    <div>
      Hey welcome to FindMyMines by Micky-Pinn-Boss
      <h3>
        Welcome to our game!! {` `}
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
      <div>
        name connected{" "}
        {nameFromServer && nameFromServer.map((user) => user.name + " + ")}
      </div>
    </div>
  );
};

export default GamePage;
