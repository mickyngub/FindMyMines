import React, { useEffect, useState } from "react";
import Grids from "../Components/Grids";

import Grid from "@material-ui/core/Grid";

import "./Game.css";

const Game = ({ ready }) => {
  let arrayAnother = [];
  let arrayNum = [];
  const [arrayRandom, setArrayRandom] = useState([]);
  const generateBomb = () => {
    for (let i = 0; i < 9; i++) {
      let random = Math.floor(Math.random() * 2);
      arrayNum.push(random);
    }
    setArrayRandom(arrayNum);
  };

  const createGrid = () => {
    return arrayRandom.map((valueArray) => {
      return createOneGrid(valueArray);
    });
  };
  const createOneGrid = (zeroOrOne) => {
    console.log(zeroOrOne);
    if (zeroOrOne == 1) {
      return arrayAnother.push(
        <Grid item xs={4} className="bomb">
          this is a bomb
        </Grid>
      );
    } else {
      return arrayAnother.push(
        <Grid item xs={4} className="empty">
          this not a bomb
        </Grid>
      );
    }
  };

  return (
    <div className="center">
      <button
        className={`start-button${ready ? "-yes" : "-no"}`}
        onClick={generateBomb}
      >
        Start Game
      </button>
      {console.log("this is ready", ready)}
      <br />
      {arrayRandom}
      {arrayAnother.map((i) => i)}
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
    </div>
  );
};

export default Game;
