import React, { useState } from "react";

const TestPage = () => {
  const [count, setCount] = useState(0);
  let count2 = 1;
  console.log("render");
  return (
    <div style={{ textAlign: "center" }}>
      This is count: {count}
      This is count2: {count2}
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increase
      </button>
      <button
        onClick={() => {
          count2 = count2 + 1;
          console.log(count2);
        }}
      >
        count2
      </button>
    </div>
  );
};

export default TestPage;
