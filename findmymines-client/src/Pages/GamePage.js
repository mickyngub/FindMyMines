import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import Game from "./Game";
import "./GamePage.css";

const socket = io("http://localhost:8000");

const GamePage = ({ location }) => {
  let namesOfConnectedUserFromServer = [];
  const [nameFromServer, setNameFromServer] = useState([]);

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
    <div className="center">
      Hey welcome to FindMyMines by Micky-Pinn-Boss
      <h3 className="center">
        Welcome to our game!! {` `}
        {location.state.username} !!
      </h3>
      <Game />
      <div className="center">
        <h2>
          name connected{" "}
          {nameFromServer && nameFromServer.map((user) => user.name + " + ")}
        </h2>
      </div>
    </div>
  );
};

export default GamePage;
