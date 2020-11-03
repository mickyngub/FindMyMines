import React, { useEffect, useState } from "react";

import Grid from "@material-ui/core/Grid";
import Timer from "../Components/Timer";
import "./Game.css";

const Game = ({ ready, socket, nameFromServer }) => {
  let arrayBombValue = [];
  const [arrayRandom, setArrayRandom] = useState([]);
  const [gameStart, setGameStart] = useState(false);
  const [player, setPlayer] = useState(false);
  const [clientTimer, setClientTimer] = useState(0);
  const generateBomb = () => {
    for (let i = 0; i < 36; i++) {
      let bombValue = Math.floor(Math.random() * 2);
      arrayBombValue.push(bombValue);
    }
    setArrayRandom((prev) => (prev = arrayBombValue));
    socket.emit("bombLocation", arrayBombValue);
    setGameStart(true);
    socket.emit("gameStart");
  };

  useEffect(() => {
    console.log("this is arrayRandom", arrayRandom);
    socket.on("timerFromServer", (timer) => {
      setClientTimer(timer);
      // console.log("this is timer in client", timer);
      if (timer == 10) {
        console.log("setPlayer");
        setPlayer((prev) => !prev);
      }
      // setPlayer((prev) => !prev);
    });
    socket.on("gameStartFromServer", () => {
      setGameStart(true);
      setPlayer((prev) => !prev);
    });

    socket.on("bombFromServer", (arrayBombLocation) => {
      console.log("io.on received bombFromServer", arrayBombLocation);
      setArrayRandom((prev) => (prev = arrayBombLocation));
    });
  }, []);

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
        <Grid container spacing={0} className="grid-container">
          {arrayRandom.map((i) => {
            if (i === 1) {
              return (
                <Grid
                  item
                  xs={2}
                  onClick={() => console.log("This is a bomb!!")}
                  className={`${player ? "can-click" : "cannot-click"}`}
                >
                  <h3>Bomb!</h3>
                </Grid>
              );
            } else {
              return (
                <Grid
                  item
                  xs={2}
                  onClick={() => console.log("Not a bomb!!")}
                  className={`${player ? "can-click" : "cannot-click"}`}
                >
                  <h3>not a bomb!</h3>
                </Grid>
              );
            }
          })}
        </Grid>
      </div>
      {/* <Timer gameStart={gameStart} socket={socket} /> */}
      <div>
        {console.log("rerender inside div")}
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
      <h3>This is Client Timer {clientTimer}</h3>
    </div>
  );
};

export default Game;
