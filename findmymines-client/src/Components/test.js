import React, { useState, useEffect } from "react";

const Timer = ({ gameStart, socket }) => {
  const [timer, setTimer] = useState(10);
  const [test, setTest] = useState(false);
  //   const [timesup, setTimesup] = useState(false);
  //   if (timer === 0) {
  //     setTimesup(true);
  //   }
  const onTestHandler = () => {
    setTest((prev) => !prev);
  };

  useEffect(() => {
    if (gameStart) {
      const interval = setInterval(() => {
        let i = 9999;
        if (i % 10 === 0) {
          // setTimer((current) => {
          //   current = 5;
          // });
          socket.emit("timerZero");
          setTimer(10);
          // i = 5;
          console.log("this still gets called");
        } else {
          setTimer((current) => current - 1);
        }
        i = i - 1;
        console.log("rerender");
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStart]);

  if (gameStart === true) {
    return <div>Play time!!{timer}</div>;
  } else {
    return <div>Game has not started</div>;
  }
};

export default Timer;
