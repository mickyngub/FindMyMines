import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Typography from "@material-ui/core/Typography";

import Game from "./Game";
import "./GamePage.css";

const socket = io("http://localhost:8000");

const GamePage = ({ location }) => {
  // let namesOfConnectedUserFromServer = [];
  const [status, setStatus] = useState(false);
  const [nameFromServer, setNameFromServer] = useState([]);

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
    // if (nameFromServer.indexOf(location.state.username) === -1) {
    socket.emit("name-of-player", location.state.username);
    // }
  }, []);
  return (
    <div className={`center`}>
      <Typography variant="h1">FindMyMines by Micky-Pinn-Boss</Typography>{" "}
      <Typography variant="h2">Welcome to our game,</Typography>
      <Typography variant="h1" gutterBottom>
        {location.state.username}
      </Typography>{" "}
      {/* !! With the id {location.state.id} */}
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
