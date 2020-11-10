import React from "react";
import "./HowToPage.css";
import Snowflakes from "./SnowFlakes.js"

const HowToPage = ({ history }) => {
    return (
        <div className="App" style={{ marginTop: "5vh"}}>
      <item style={{fontWeight:"bold", fontFamily:"serif"}}>
        <h1 className="App-item">How to play and our rules</h1></item>
      <item className="App-terms">
        <div>1.The first player is randomly selected.</div>
        <div>2.There are 11 bombs randomly placed.</div>
        <div>3.Each player has only 10 seconds on each turn to choose a slot.</div>
        <div>4.The more bombs you find, the more points you earn.</div>
      </item>
      <item className="App-terms" style={{fontWeight:"bold"}}>
        <div>Importantly! Find the bombs as many as you can. GOOD LUCK :)</div>
      </item>
      <button className= "button" onClick={() => history.push('/NamePage')}><span>Begin the game!</span></button>
      <Snowflakes></Snowflakes>
    </div>
    );
    };

export default HowToPage;