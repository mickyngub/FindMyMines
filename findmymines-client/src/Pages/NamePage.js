import React, { useState } from "react";
import "./NamePage.css";

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
      <h3 style={{ width: "50vw", height: "10vh" }}>What's your name?</h3>
      <input
        style={{ width: "50vw", height: "10vh" }}
        placeholder="Please Enter Your Name"
        onChange={(e) => setUserName(e.target.value)}
      ></input>

      <button
        style={{ width: "50vw", height: "10vh" }}
        onClick={onClickHandler}
      >
        Go to GamePage
      </button>
    </div>
  );
};

export default NamePage;
