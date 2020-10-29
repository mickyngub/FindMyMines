import React, { useState } from "react";
import "./NamePage.css";

const NamePage = ({ history }) => {
  console.log(history);
  const [username, setUserName] = useState("");
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
