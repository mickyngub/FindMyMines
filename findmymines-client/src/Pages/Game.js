import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import Scoreboard from "../Components/Scoreboard";

import "./Game.css";
import bombPic from "../Pics/bombPic.png";
import notBombPic from "../Pics/notBombPic.jpg";

const Game = ({ ready, socket, nameFromServer, playerName }) => {
  let arrayBombValue = [];
  let opponentName = "";
  const [arrayRandom, setArrayRandom] = useState([]);
  const [gameStart, setGameStart] = useState(false);
  const [player, setPlayer] = useState(false);
  const [yourScore, setYourScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [clientTimer, setClientTimer] = useState(10);
  const generateBomb = () => {
    for (let i = 0; i < 36; i++) {
      // let bombValue = Math.floor(Math.random() * 2);
      if (i < 11) {
        arrayBombValue.push(1);
      } else {
        arrayBombValue.push(0);
      }
      // arrayBombValue.push(bombValue);
    }
    arrayBombValue = shuffleBomb(arrayBombValue);
    setArrayRandom((prev) => (prev = arrayBombValue));
    socket.emit("bombLocation", arrayBombValue);
    setGameStart(true);
    let randomPlayerValue = Math.random();
    console.log("this is random value", randomPlayerValue);
    socket.emit("gameStart", randomPlayerValue);
    if (randomPlayerValue >= 0.5) {
      setPlayer(true);
    } else {
      setPlayer(false);
    }
  };
  const shuffleBomb = (arrayBomb) => {
    let ctr = arrayBomb.length;
    let temp;
    let index;

    // While there are elements in the array
    while (ctr > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * ctr);
      // Decrease ctr by 1
      ctr--;
      // And swap the last element with it
      temp = arrayBomb[ctr];
      arrayBomb[ctr] = arrayBomb[index];
      arrayBomb[index] = temp;
    }
    return arrayBomb;
  };
  if (nameFromServer[1]) {
    if (nameFromServer[1].name === playerName) {
      opponentName = nameFromServer[0].name;
    } else {
      opponentName = nameFromServer[1].name;
    }
  }
  // 0 is not bomb
  // 1 is bomb
  // 2 is not bomb and clicked
  // 3 is bomb and clicked
  const notBombIsClicked = (index, arrayRandom) => {
    console.log("value before not bomb", arrayRandom);
    arrayRandom[index] = 2;
    console.log("value after not bomb", arrayRandom);
    setArrayRandom(arrayRandom);

    socket.emit("bombLocation", arrayRandom);
  };
  const bombIsClicked = (index, arrayRandom) => {
    console.log("value before bomb", arrayRandom);

    arrayRandom[index] = 3;
    console.log("value after bomb", arrayRandom);
    setArrayRandom(arrayRandom);
    socket.emit("bombLocation", arrayRandom);
    setYourScore((prev) => prev + 1);
    socket.emit("plusScore");
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
    socket.on("gameStartFromServer", (randomPlayerValue) => {
      setGameStart(true);
      if (randomPlayerValue >= 0.5) {
        setPlayer(false);
      } else {
        setPlayer(true);
      }
    });

    socket.on("bombFromServer", (arrayBombLocation) => {
      console.log("io.on received bombFromServer", arrayBombLocation);
      setArrayRandom(arrayBombLocation);
    });

    socket.on("plusScoreFromServer", () => {
      setOpponentScore((prev) => prev + 1);
    });
  }, []);

  return (
    <>
      <Scoreboard nameFromServer={nameFromServer} />
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
        {console.log("this is arrayRandom", arrayRandom)}
        <div className="game">
          <Grid container spacing={0} className="grid-container">
            {arrayRandom.map((value, index) => {
              if (value === 1) {
                return (
                  <Grid
                    item
                    xs={2}
                    onClick={() => {
                      bombIsClicked(index, arrayRandom);
                      console.log("bomb is clicked", index);
                    }}
                    className={`${player ? "can-click" : "cannot-click"}`}
                  >
                    <h3>Bomb!</h3>
                  </Grid>
                );
              } else if (value === 0) {
                return (
                  <Grid
                    item
                    xs={2}
                    onClick={() => {
                      notBombIsClicked(index, arrayRandom);
                      console.log("NOT bomb is clicked", index);
                    }}
                    className={`${player ? "can-click" : "cannot-click"}`}
                  >
                    <h3>not a bomb!</h3>
                  </Grid>
                );
              } else if (value === 2) {
                return (
                  <Grid
                    item
                    xs={2}
                    className={`${player ? "can-click" : "cannot-click"}`}
                  >
                    <img className="pic" src={notBombPic}></img>
                  </Grid>
                );
              } else {
                return (
                  <Grid
                    item
                    xs={2}
                    className={`${player ? "can-click" : "cannot-click"}`}
                  >
                    <img className="pic" src={bombPic}></img>
                  </Grid>
                );
              }
            })}
          </Grid>
        </div>
        {/* <Timer gameStart={gameStart} socket={socket} /> */}
      </div>
      <div>
        {/* {gameStart ? (
          <Typography variant="h4">
            {nameFromServer[1] && player === false
              ? nameFromServer[1].name + "'s turn"
              : ""}
            {nameFromServer[0] && player === true
              ? nameFromServer[0].name + "'s turn"
              : ""}
          </Typography>
        ) : (
          ""
        )} */}
        {gameStart ? (
          <Typography variant="h4">
            {player ? "Your turn" : "Opponent's turn"}
          </Typography>
        ) : (
          ""
        )}
        {/* <button
        onClick={() => {
          setPlayer((prev) => !prev);
        }}
      >
        Switch Player
      </button> */}

        <Typography variant="h3">
          Players in lobby :
          {nameFromServer &&
            nameFromServer.map((user, index) => {
              if (index === 1) {
                return " , " + user.name;
              } else {
                return " " + user.name;
              }
            })}{" "}
        </Typography>
        <Typography variant="h3">
          {nameFromServer && nameFromServer.length} people are in this lobby
        </Typography>
        <h3>This is Client Timer {clientTimer}</h3>
        <h2>
          This is {playerName} score {yourScore}
          This is {opponentName}'s score {opponentScore}
        </h2>
      </div>
    </>
  );
};

export default Game;
