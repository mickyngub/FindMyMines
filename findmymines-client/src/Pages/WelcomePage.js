import React, { useState } from "react";
import "./WelcomePage.css";
import Snowflakes from "./SnowFlakes.js";
import Slider from "@material-ui/core/Slider";

const WelcomePage = ({ history }) => {
  console.log(history);
  const [username, setUserName] = useState("");
  //If go to GamePage button is click then it will redirect to GamePage.js with the username that has been filled out
  //The id doesn't do anything, it was for the purpose of testing
  const onClickHandler = () => {
    history.push("/NamePage", { id: 1, username });
  };
  const myFunction = () => {
    var element = document.body;
    element.classList.toggle("dark-mode");
  };
  const soundUrl = "http://www.music-note.jp/bgm/mp3/xmas/1205/xmaspresent.mp3";
  const SAudio = new Audio(soundUrl);
  const playSound = (audioFile) => {
    audioFile.play();
  };

  const stopSound = (audioFile) => {
    audioFile.pause();
  };
  var toggleflag = false;
  const togglePlay1 = () => {
    if (toggleflag) {
      stopSound(SAudio);
      toggleflag = !toggleflag;
    } else {
      playSound(SAudio);
      toggleflag = !toggleflag;
    }
  };

  return (
    <div className="App" style={{ marginTop: "40vh" }}>
      <div className="Wtxt">Hey welcome to "FindMyMines"</div>
      <div className="Wtxt2">by Micky-Pinn-Boss</div>
      <button className="button" onClick={() => history.push("/NamePage")}>
        <span>Begin the game!</span>
      </button>
      <button
        className="button"
        style={{ marginLeft: "2%" }}
        onClick={() => history.push("/HowToPage")}
      >
        <span>How to play?</span>
      </button>
      <section>
        <label for="toggle-2" class="toggle-2">
          <input
            onClick={myFunction}
            type="checkbox"
            name="toggle-2"
            id="toggle-2"
            class="toggle-2__input"
          ></input>
          <span class="toggle-2__button">
            <img
              src="https://raw.githubusercontent.com/nueymoo/toggle-switch-css/master/sun.png"
              alt="sun"
              class="toggle-2__button--icon"
            ></img>
            <img
              src="https://raw.githubusercontent.com/nueymoo/toggle-switch-css/master/moon.png"
              alt="moon"
              class="toggle-2__button--icon"
            ></img>
          </span>
        </label>
        <label for="toggle-3" class="toggle-3">
          <input
            type="checkbox"
            name="toggle-3"
            id="toggle-3"
            class="toggle-3__input"
            onClick={togglePlay1}
          ></input>
          <span class="toggle-3__button">
            <img
              src="https://raw.githubusercontent.com/nueymoo/toggle-switch-css/master/correct.png"
              alt="correct"
              class="toggle-3__button--correct"
            ></img>
          </span>
        </label>
      </section>
      <Snowflakes></Snowflakes>
    </div>
  );
};

export default WelcomePage;
