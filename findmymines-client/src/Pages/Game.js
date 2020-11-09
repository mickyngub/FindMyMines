import React, { useEffect, useState } from "react";
//import from library called material-ui to make it looks nicer
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";

import "./Game.css";
import bombPic from "../Pics/bombPic.png";
import notBombPic from "../Pics/notBombPic.jpg";

//main function of this file
const Game = ({ ready, socket, nameFromServer, playerName }) => {
  let arrayBombValue = [];
  let opponentName = "";
  //array to tell where the bomb is
  const [arrayRandom, setArrayRandom] = useState([]);
  const [gameStart, setGameStart] = useState(false);
  //state to tell if this is client's turn
  const [player, setPlayer] = useState(false);
  const [yourScore, setYourScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  //Timer is controls by the server in the index.js, Clients just need to display the value
  const [clientTimer, setClientTimer] = useState(10);
  //If isClicked is true then client cannot click the grid anymore in this turn
  const [isClicked, setIsClicked] = useState(false);
  //whether win or lose
  const [resultGame, setResultGame] = useState("");
  const [gameEnd, setGameEnd] = useState(false);

  //get called once the start game button is clicked to generate where the bomb is
  const generateBomb = () => {
    clearOldSession();
    for (let i = 0; i < 36; i++) {
      //This i value controls how many bombs are in the grid e.g. if i === 3 then there are three bombs
      if (i < 3) {
        arrayBombValue.push(1);
      } else {
        arrayBombValue.push(0);
      }
    }
    //shuffle where the bombs are
    arrayBombValue = shuffleBomb(arrayBombValue);
    setArrayRandom(arrayBombValue);
    socket.emit("bombLocation", arrayBombValue);
    setGameStart(true);
    //Random who is the first player
    let randomPlayerValue = Math.random();
    socket.emit("gameStart", randomPlayerValue);

    if (randomPlayerValue >= 0.5) {
      //The player who clicked start button is the start player
      setPlayer(true);
    } else {
      //The player who clicked start button is not the start player
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
    arrayRandom[index] = 2;
    setArrayRandom(arrayRandom);
    socket.emit("bombLocation", arrayRandom);
    setIsClicked(true);
    socket.emit("changeTurn");
  };
  const bombIsClicked = (index, arrayRandom) => {
    arrayRandom[index] = 3;
    setArrayRandom(arrayRandom);
    socket.emit("bombLocation", arrayRandom);
    setYourScore((prev) => prev + 1);
    socket.emit("plusScore");
    socket.emit("changeTurn");
    //If there are no value of 1 left in the array that means the game has ended
    if (arrayRandom.indexOf(1) === -1) {
      socket.emit("gameEnd");
    }
    setIsClicked(true);
  };

  const clearOldSession = () => {
    setYourScore(0);
    setOpponentScore(0);
    setResultGame("");
    setIsClicked(false);
  };

  socket.on("gameEndFromServer", () => {
    if (yourScore > opponentScore) {
      setResultGame("You won!!!");
    } else {
      setResultGame("You lost!!!");
    }
    setArrayRandom([]);
    setGameStart(false);
    setGameEnd(true);
  });
  //This useEffect function only run once, to mount the functions that wait for the connection from the server
  useEffect(() => {
    socket.on("changeTurnFromServer", (timer) => {
      setPlayer((prev) => !prev);
      setIsClicked(false);
    });
    socket.on("timerFromServer", (timer) => {
      setClientTimer(timer);
      if (timer === 10) {
        console.log("setPlayer");
        setPlayer((prev) => !prev);
        setIsClicked(false);
      }
    });
    socket.on("gameStartFromServer", (randomPlayerValue) => {
      clearOldSession();
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
        {/* This is the array value of where the bomb, notbomb, and which grids have
        been clicked */}
        {/* !!This is a little buggy since if one players click the grid, it doesn't update the value in that player's screen until another player selected another grid!! */}
        {arrayRandom}
        <div>
          {/* The grids are rendered based on the value in the array */}
          <Grid container spacing={0} className="grid-container">
            {arrayRandom.map((value, index) => {
              if (value === 1) {
                return (
                  <Grid
                    item
                    xs={2}
                    onClick={() => {
                      bombIsClicked(index, arrayRandom);
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
                    <img
                      className="pic"
                      src={notBombPic}
                      alt="notBombPic"
                    ></img>
                  </Grid>
                );
              } else if (value === 3) {
                return (
                  <Grid
                    item
                    xs={2}
                    className={`${player ? "can-click" : "cannot-click"}`}
                  >
                    <img className="pic" src={bombPic} alt="bombPic"></img>
                  </Grid>
                );
              } else {
                return;
              }
            })}
          </Grid>
        </div>
      </div>
      <div>
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

        <Typography style={{ "margin-top": "3vh" }} variant="h3">
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
        <Typography style={{ "margin-top": "6vh" }} variant="h2">
          {resultGame}
        </Typography>
      </div>
    </>
  );
};

export default Game;
