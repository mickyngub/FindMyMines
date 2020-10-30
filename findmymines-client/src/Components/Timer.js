import React, { useState, useEffect } from "react";

const Timer = ({ gameStart }) => {
  const [timer, setTimer] = useState(5);
  const [test, setTest] = useState(false);
  //   const [timesup, setTimesup] = useState(false);
  //   if (timer === 0) {
  //     setTimesup(true);
  //   }
  const onTestHandler = () => {
    setTest((prev) => !prev);
  };
  useEffect(() => {
    console.log("useEffect is called");
    if (gameStart) {
      const interval = setInterval(() => {
        setTimer((current) => current - 1);
      }, 1000);
      if (test) {
        clearInterval(interval);
      }

      console.log("this line is called");
      return () => clearInterval(interval);
    }
  }, [gameStart, test]);

  if (gameStart == true) {
    return (
      <div>
        {timer}
        <button onClick={onTestHandler}>teststop</button>
      </div>
    );
  } else {
    return <div>not yet</div>;
  }
};

export default Timer;
