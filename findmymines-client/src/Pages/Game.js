import React, { useEffect, useState } from "react";
//import from library called material-ui to make it looks nicer
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";

import "./Game.css";
import bombPic from "../Pics/bombPic.png";
import coin from "../Pics/coin.jpeg";
import trophy from "../Pics/trophy.png"
import timer from "../Pics/timer.jpg"
import notBombPic from "../Pics/notBombPic.jpg";
import resetPic from "../Pics/reset.png"
import { height } from "@material-ui/system";

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
      if (i < 6) {
        arrayBombValue.push(1);
      }
      else if (i<8){
        arrayBombValue.push(4);
      } else if (i<9){
        arrayBombValue.push(8);
      } else if (i<12){
        arrayBombValue.push(6);
      }else {
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
  const CoinIsClicked = (index, arrayRandom) => {
    arrayRandom[index] = 5;
    setArrayRandom(arrayRandom);
    socket.emit("bombLocation", arrayRandom);
    setYourScore((prev) => prev - 1);
    socket.emit("deductScore");
    socket.emit("changeTurn");
    setIsClicked(true);
  };
  const TimerIsClicked = (index, arrayRandom) => {
    arrayRandom[index] = 7;
    setArrayRandom(arrayRandom);
    socket.emit("bombLocation", arrayRandom);
    socket.emit("DoubleTime");
  };
  const TrophyIsClicked = (index, arrayRandom) => {
    arrayRandom[index] = 8;
    setArrayRandom(arrayRandom);
    socket.emit("bombLocation", arrayRandom);
    setArrayRandom([]);
    setGameStart(false);
    setGameEnd(true);
    socket.emit("gameEndBySurrender2");
    setResultGame("You got the trophy. You won!!!");
  };

  const clearOldSession = () => {
    setYourScore(0);
    setOpponentScore(0);
    setResultGame("");
    setIsClicked(false);
  };
  const clearByReset = () => {
    setYourScore(0);
    setOpponentScore(0);
    setResultGame("");
    setIsClicked(false);
    socket.emit("gameReset");
    generateBomb();
  };
  const doubleTime = () => {
    socket.emit("DoubleTime");
  };
  const Surrender2 = () => {
    setArrayRandom([]);
    setGameStart(false);
    setGameEnd(true);
    socket.emit("gameEndBySurrender2");
    setResultGame("You lost by surrendering!!!");
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
  socket.on("gameEndByTrophyFromServer", () => {
    setResultGame("Your opponent got the trophy, you lost!!!");
    setArrayRandom([]);
    setGameStart(false);
    setGameEnd(true);
  });
  socket.on("SetScoreByTrophyFromServer", () => {
    setYourScore(0);
    setOpponentScore(1);
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
    socket.on("deductScoreFromServer", () => {
      setOpponentScore((prev) => prev - 1);
    });
    socket.on("gameEndBySurrender2FromServer", () => {
      setResultGame("The opponent surrendered, You won!!!");
      setArrayRandom([]);
      setGameStart(false);
      setGameEnd(true);
    });
    socket.on("DoubleTimerFromServer", (timer) => {
      setClientTimer(timer);
      if (timer === -1) {
        console.log("setPlayer");
        setPlayer((prev) => !prev);
        setIsClicked(false);
      }
    });
  }, []);

  return (
    <>
      {gameStart || gameEnd ? (
        <div>
          <span style={{ margin: "2vh", fontWeight: "normal", fontSize: "3vh"}}>
            {playerName}'s score {yourScore}
          </span>
          <span style={{ margin: "2vh", fontWeight: "normal", fontSize: "3vh" }}>
            {opponentName}'s score {opponentScore}
          </span>
        </div>
      ) : (
        ""
      )}
      <button
        variant="outlined"
        color="danger"
        startIcon={<PlayCircleOutlineIcon />}
        className={`button ${ready ? "-yes" : "start-no"} ${
          gameStart ? "start-no" : ""
        } `}
        onClick={generateBomb}
      >GO!</button>
      <div
        className={`center ${gameStart ? "" : "start-no"} ${
          player ? "is-playing" : "not-playing"
        }`}
      >
        <div>
        {/* This is the array value of where the bomb, notbomb, and which grids have
        been clicked */}
        {/* !!This is a little buggy since if one players click the grid, it doesn't update the value in that player's screen until another player selected another grid!! */}
        {arrayRandom}</div>
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
                    className={`Grid-wrapper ${
                      player && !isClicked ? "can-click" : "cannot-click"
                    }`}
                  >
                    B
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
                    className={`Grid-wrapper ${
                      player && !isClicked ? "can-click" : "cannot-click"
                    }`}
                  >
                    {/* <h3>not a bomb!</h3> */}
                    !
                  </Grid>
                );
              } else if (value === 2) {
                return (
                  <Grid
                    item
                    xs={2}
                    className={`Grid-wrapper ${player ? "can-click" : "cannot-click"}`}
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
                    className={`Grid-wrapper ${player ? "can-click" : "cannot-click"}`}
                  >
                    <img className="pic" src={bombPic} alt="bombPic"></img>
                  </Grid>
                );
              } else if (value === 4) {
                return (
                  <Grid
                    item
                    xs={2}
                    onClick={() => {
                      CoinIsClicked(index, arrayRandom);
                    }}
                    className={`Grid-wrapper ${
                      player && !isClicked ? "can-click" : "cannot-click"
                    }`}
                  >
                    
                    C
                  </Grid>
                );
              } else if (value === 5) {
                return (
                  <Grid
                    item
                    xs={2}
                    className={`Grid-wrapper ${player ? "can-click" : "cannot-click"}`}
                  >
                    <img className="pic" src={coin} alt="coin"></img>
                  </Grid>
                );
              } else if (value === 6) {
                return (
                  <Grid
                    item
                    xs={2}
                    onClick={() => {
                      TimerIsClicked(index, arrayRandom);
                    }}
                    className={`Grid-wrapper ${
                      player && !isClicked ? "can-click" : "cannot-click"
                    }`}
                  >
                    TM
                  </Grid>
                );
              }
              else if (value === 7) {
                return (
                  <Grid
                    item
                    xs={2}
                    className={`Grid-wrapper ${player ? "can-click" : "cannot-click"}`}
                  >
                    <img className="pic" src={timer} alt="timer"></img>
                  </Grid>
                );
              } else if (value === 8) {
                return (
                  <Grid
                    item
                    xs={2}
                    onClick={() => {
                      TrophyIsClicked(index, arrayRandom);
                    }}
                    className={`Grid-wrapper ${
                      player && !isClicked ? "can-click" : "cannot-click"
                    }`}
                  >
                    T
                  </Grid>
                );
              }else if (value === 9) {
                return (
                  <Grid
                    item
                    xs={2}
                    className={`Grid-wrapper ${player ? "can-click" : "cannot-click"}`}
                  >
                    <img className="pic" src={trophy} alt="trophy"></img>
                  </Grid>
                );
              } else {
                return;
              }
            })}
          </Grid>
        </div>
        <div>
            <button className="buttong" style={{marginLeft: "-15%", minWidth: "9%",position: "absolute"}} onClick={clearByReset}>
              <span>reset</span>
            </button>
            <button className="buttong" style={{marginLeft: "-5%", minWidth: "14%",position: "absolute"}}onClick={doubleTime}>
              <span>Time x2</span>
            </button>
            <button className="buttong" style={{marginLeft: "10%", minWidth: "14%",position: "absolute"}} onClick={Surrender2}>Surrender</button>
        </div>
      </div>
      <div>
        {gameStart ? (
          <>
          <div>
          {player ? "Your turn" : "Opponent's turn"}
          </div>
            <span style={{fontSize:"80%"}}>
                <HourglassEmptyIcon />
                Timer {clientTimer}
            </span>
          </>
        ) : (
          ""
        )}
        <div className="text">
          Players in lobby :
          {nameFromServer &&
            nameFromServer.map((user, index) => {
              if (index === 1) {
                return " , " + user.name;
              } else {
                return " " + user.name;
              }
            })}{" "}
            <div className="text2">
              {nameFromServer && nameFromServer.length} people are in this lobby
            </div>
        </div>
        <div>
          {resultGame}
        </div>
      </div>
    </>
  );
};

export default Game;
