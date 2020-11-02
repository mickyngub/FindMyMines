import React, { useEffect, useState } from "react";

import Grid from "@material-ui/core/Grid";
import Timer from "../Components/Timer";
import "./Game.css";

const Game = ({ ready, socket, nameFromServer }) => {
  let arrayBombValue = [];
  const [arrayRandom, setArrayRandom] = useState([]);
  const [gameStart, setGameStart] = useState(false);
  const [player, setPlayer] = useState(false);

  const generateBomb = () => {
    for (let i = 0; i < 9; i++) {
      let bombValue = Math.floor(Math.random() * 2);
      arrayBombValue.push(bombValue);
    }
    setArrayRandom((prev) => (prev = arrayBombValue));
    socket.emit("bombLocation", arrayBombValue);
    setGameStart((prev) => !prev);
    socket.emit("gameStart");
  };

  socket.on("gameStartFromServer", () => {
    setGameStart((prev) => !prev);
    setPlayer((prev) => !prev);
  });

  socket.on("bombFromServer", (arrayBombLocation) => {
    console.log("io.on received bombFromServer", arrayBombLocation);
    setArrayRandom((prev) => (prev = arrayBombLocation));
  });

  useEffect(() => {
    console.log("this is arrayRandom", arrayRandom);
  }, [arrayRandom, nameFromServer]);

  return (
    <div className={`center ${player ? "is-playing" : "not-playing"}`}>
      <button
        className={`start-button${ready ? "-yes" : "-no"} ${
          gameStart ? "start-no" : ""
        } `}
        onClick={generateBomb}
      >
        Start Game
      </button>
      <br />
      {arrayRandom}
      <div className="game">
        {arrayRandom.map((i) => {
          if (i === 1) {
            return (
              <Grid item className="bomb">
                <h3>Bomb!</h3>
              </Grid>
            );
          } else {
            return (
              <Grid item className="empty">
                <h3>not a bomb!</h3>
              </Grid>
            );
          }
        })}
      </div>
      <Timer gameStart={gameStart} />
      <div>
        {console.log("this name from server", nameFromServer)}
        {nameFromServer[1] && player === false
          ? nameFromServer[1].name + "'s turn"
          : ""}
        {nameFromServer[0] && player === true
          ? nameFromServer[0].name + "'s turn"
          : ""}
      </div>
      <button
        onClick={() => {
          setPlayer((prev) => !prev);
        }}
      >
        Switch Player
      </button>
      {nameFromServer && nameFromServer.map((user) => " " + user.name)} is in
      the lobby
      {console.log('THIS IS PLAYER"s VLUAE', player)}
    </div>
  );
};

export default Game;
