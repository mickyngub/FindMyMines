import React, { useState } from "react";

const NamePage = ({ history }) => {
  console.log(history);
  const [username, setUserName] = useState("");
  const onClickHandler = () => {
    history.push("/GamePage", { id: 1, username });
  };
  return (
    <div>
      <h3>What's your name?</h3>
      <input
        placeholder="Please Enter Your Name"
        onChange={(e) => setUserName(e.target.value)}
      ></input>

      <button onClick={onClickHandler}>Go to GamePage</button>
    </div>
  );
};

export default NamePage;
