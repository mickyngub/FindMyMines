import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";

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
  const [isClicked, setIsClicked] = useState(false);
  const [resultGame, setResultGame] = useState("");
  const [gameEnd, setGameEnd] = useState(false);
  // const [numberOfGames, setNumberOfGames] = useState(0);
  const generateBomb = () => {
    // setNumberOfGames((prev) => prev + 1);
    setYourScore(0);
    setOpponentScore(0);
    setResultGame("");
    setIsClicked(false);
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

  //set opponent's name
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
    setIsClicked(true);
  };
  const bombIsClicked = (index, arrayRandom) => {
    console.log("value before bomb", arrayRandom);

    arrayRandom[index] = 3;
    console.log("value after bomb", arrayRandom);
    setArrayRandom(arrayRandom);
    socket.emit("bombLocation", arrayRandom);
    setYourScore((prev) => prev + 1);
    socket.emit("plusScore");
    if (arrayRandom.indexOf(1) === -1) {
      socket.emit("gameEnd");
    }
    setIsClicked(true);
  };

  socket.on("gameEndFromServer", () => {
    console.log("your score is", yourScore);
    console.log("opponent score is", opponentScore);
    if (yourScore > opponentScore) {
      setResultGame("You won!!!");
    } else {
      setResultGame("You lost!!!");
    }
    setArrayRandom([]);
    setGameStart(false);
    setGameEnd(true);
  });

  useEffect(() => {
    socket.on("timerFromServer", (timer) => {
      setClientTimer(timer);
      // console.log("this is timer in client", timer);
      if (timer == 10) {
        console.log("setPlayer");
        setPlayer((prev) => !prev);
        setIsClicked(false);
      }
      // setPlayer((prev) => !prev);
    });
    socket.on("gameStartFromServer", (randomPlayerValue) => {
      setYourScore(0);
      setOpponentScore(0);
      setResultGame("");
      setIsClicked(false);
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
      {/* <Scoreboard nameFromServer={nameFromServer} /> */}
      {gameStart || gameEnd ? (
        <Typography variant="h4">
          <span style={{ margin: "3vw" }}>
            {playerName}'s score {yourScore}
          </span>
          <span style={{ margin: "3vw" }}>
            {opponentName}'s score {opponentScore}
          </span>
        </Typography>
      ) : (
        ""
      )}
      <Button
        variant="outlined"
        color="primary"
        startIcon={<PlayCircleOutlineIcon />}
        className={`start-button${ready ? "-yes" : "-no"} ${
          gameStart ? "start-no" : ""
        } `}
        onClick={generateBomb}
      >
        <Typography variant="button">Start Game</Typography>
      </Button>
      <div
        className={`center ${gameStart ? "" : "start-no"} ${
          player ? "is-playing" : "not-playing"
        }`}
      >
        {arrayRandom}
        {/* {console.log("this is arrayRandom", arrayRandom)} */}
        <div>
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
                    className={`${
                      player && !isClicked ? "can-click" : "cannot-click"
                    }`}
                  >
                    <h3>Bomb!</h3>
                    {/* <h2>Click me!</h2> */}
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
                    className={`${
                      player && !isClicked ? "can-click" : "cannot-click"
                    }`}
                  >
                    {/* <h3>not a bomb!</h3> */}
                    <h2>Click me!</h2>
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
              } else if (value === 3) {
                return (
                  <Grid
                    item
                    xs={2}
                    className={`${player ? "can-click" : "cannot-click"}`}
                  >
                    <img className="pic" src={bombPic}></img>
                  </Grid>
                );
              } else {
                return;
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
          <>
            <Typography variant="h3">
              {player ? "Your turn" : "Opponent's turn"}
            </Typography>
            <span>
              <Typography variant="h5">
                <HourglassEmptyIcon />
                Timer {clientTimer}
              </Typography>
            </span>
          </>
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
        {resultGame}
      </div>
    </>
  );
};

export default Game;
