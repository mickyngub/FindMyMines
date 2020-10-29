import React, { useEffect, useState } from "react";
import Grids from "../Components/Grids";

import Grid from "@material-ui/core/Grid";

import "./Game.css";

const Game = () => {
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
    <div>
      <button onClick={generateBomb}>Start Game</button>
      <br />

      {arrayRandom}
      {arrayAnother.map((i) => i)}

      <div style={{ textAlign: "center" }}>
        {arrayRandom.map((i) => {
          if (i === 1) {
            return (
              <Grid item xs={4} className="bomb">
                this is a bomb
              </Grid>
            );
          } else {
            return (
              <Grid item xs={4} className="empty">
                this is a bomb
              </Grid>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Game;
