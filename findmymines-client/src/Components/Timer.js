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
    console.log("useEffect is called");
    let i = 9999;
    if (gameStart) {
      const interval = setInterval(() => {
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
      }, 1000);

      if (test) {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
    // if (gameStart) {
    //   let x = 5;
    //   while (x > 0) {
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    //     setTimer((current) => current - 1);
    //     x = x - 1;
    //   }
    // }
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
