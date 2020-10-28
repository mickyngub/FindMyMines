import React from "react";

import { Link } from "react-router-dom";

const NamePage = () => {
  return (
    <div>
      <h3>What's your name?</h3>
      <Link to="/GamePage">ENTER</Link>
    </div>
  );
};

export default NamePage;
