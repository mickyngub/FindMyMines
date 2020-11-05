import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Typography from "@material-ui/core/Typography";

import Game from "./Game";
import "./GamePage.css";

const socket = io("http://localhost:8000");

const GamePage = ({ location }) => {
  const [status, setStatus] = useState(false);
  const [nameFromServer, setNameFromServer] = useState([]);
  //This use effect only run once after render, so it emits the name of the user to the server and waiting for other users
  useEffect(() => {
    socket.emit("name-of-player", location.state.username);
    socket.on("name-of-users-connected", (nameObj) => {
      setNameFromServer([...nameObj]);
      console.log(nameObj);
      console.log(status);
      console.log(nameObj.length);
      //check whether are there two players in the lobby
      if (nameObj.length === 2) {
        setStatus(true);
        console.log(status);
      }
    });
  }, []);
  return (
    <div className={`center`}>
      <Typography variant="h1">FindMyMines by Micky-Pinn-Boss</Typography>{" "}
      <Typography variant="h2">Welcome to our game,</Typography>
      <Typography variant="h1" gutterBottom>
        {location.state.username}
      </Typography>{" "}
      {/* This is game component in the Game.js file, passing playerName, ready, socket, and nameFromServer so that it can be used inside Game.js */}
      <Game
        playerName={location.state.username}
        ready={status}
        socket={socket}
        nameFromServer={nameFromServer}
      />
    </div>
  );
};

export default GamePage;
