import React, { useState } from "react";
import "./NamePage.css";
import Snowflakes from "./SnowFlakes.js";

const NamePage = ({ history }) => {
  console.log(history);
  const [username, setUserName] = useState("");
  //If go to GamePage button is click then it will redirect to GamePage.js with the username that has been filled out
  //The id doesn't do anything, it was for the purpose of testing
  const onClickHandler = () => {
    history.push("/GamePage", { id: 1, username });
  };
  return (
    <div className="center-namepage">
      <div className="introText">Let's find your friend's MINES :)</div>
      <item className="App-item">
        <ul id="messages"></ul>
        <div onClick={onClickHandler}></div>
        <div className="TypeName">Please type your name first</div>
        <div>
          <input
            className="block"
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            placeholder="Please enter your name"
          ></input>
        </div>
        <button className="button" onClick={onClickHandler}>
          Submit
        </button>
        <div>This is your name {username}</div>
      </item>
      <Snowflakes></Snowflakes>
    </div>
  );
};

export default NamePage;
