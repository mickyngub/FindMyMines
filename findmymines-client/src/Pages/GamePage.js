import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import Game from "./Game";
import "./GamePage.css";

const socket = io("http://localhost:8000");

const GamePage = ({ location }) => {
  // let namesOfConnectedUserFromServer = [];
  const [status, setStatus] = useState(false);
  const [nameFromServer, setNameFromServer] = useState([]);
  const [player, setPlayer] = useState(false);

  useEffect(() => {
    socket.on("name-of-users-connected", (nameObj) => {
      // namesOfConnectedUserFromServer = [...nameObj];
      setNameFromServer([...nameObj]);
      console.log(nameObj);
      console.log(status);
      console.log(nameObj.length);

      if (nameObj.length === 2) {
        setStatus(true);
        console.log(status);
      }
    });
    if (nameFromServer.indexOf(location.state.username) === -1) {
      socket.emit("name-of-player", location.state.username);
    }
  }, []);
  return (
    <div className={`center ${player == false ? "player1" : "player2"}`}>
      Hey welcome to FindMyMines by Micky-Pinn-Boss
      <h3>
        Welcome to our game, {` `}
        {location.state.username} !!
      </h3>
      <Game ready={status} socket={socket} />
      <h2>
        Players connected{" "}
        {nameFromServer && nameFromServer.map((user) => user.name + " + ")}
        <div>number of players in the lobby {nameFromServer.length}</div>
      </h2>
      <div>{player === false ? "Player1's turn" : "Player2's turn"}</div>
      <button
        onClick={() => {
          setPlayer((prev) => !prev);
        }}
      >
        Switch Player
      </button>
    </div>
  );
};

export default GamePage;
