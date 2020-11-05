import React from "react";
import "./App.css";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import GamePage from "./Pages/GamePage";
import NamePage from "./Pages/NamePage";

//The App.js's main duty is to setup a route for the website
const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={NamePage} />
        <Route path="/GamePage" exact component={GamePage} />{" "}
        <Route path="/" render={() => <div>404 not found</div>} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
