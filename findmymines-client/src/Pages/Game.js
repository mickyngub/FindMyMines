import React, { useEffect, useState } from "react";

import Grid from "@material-ui/core/Grid";
import Timer from "../Components/Timer";
import "./Game.css";

const Game = ({ ready, socket }) => {
  let arrayBombValue = [];
  const [arrayRandom, setArrayRandom] = useState([]);
  const [gameStart, setGameStart] = useState(false);
  const generateBomb = () => {
    for (let i = 0; i < 9; i++) {
      let bombValue = Math.floor(Math.random() * 2);
      arrayBombValue.push(bombValue);
    }
    setArrayRandom((prev) => (prev = arrayBombValue));
    socket.emit("bombLocation", arrayBombValue);
    setGameStart((prev) => !prev);
  };

  useEffect(() => {
    socket.on("bombFromServer", (arrayBombLocation) => {
      console.log("io.on received bombFromServer", arrayBombLocation);
      setArrayRandom((prev) => (prev = arrayBombLocation));
    });
    console.log("this is arrayRabndom", arrayRandom);
  }, [arrayRandom]);
  return (
    <div className="center">
      <button
        className={`start-button${ready ? "-yes" : "-no"}`}
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
    </div>
  );
};

export default Game;
