import React from "react";
import "./App.css";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import GamePage from "./Pages/GamePage";
import HowToPage from "./Pages/HowToPage";
import NamePage from "./Pages/NamePage";
import WelcomePage from "./Pages/WelcomePage";

//The App.js's main duty is to setup a route for the website
const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={WelcomePage} />
        <Route path="/HowToPage" exact component={HowToPage} />
        <Route path="/NamePage" exact component={NamePage} />
        <Route path="/GamePage" exact component={GamePage} />{" "}
        <Route path="/" render={() => <div>404 not found</div>} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
