import React, { Component } from "react";
import { Router } from "react-router-dom";
import MainHeader from "./comp_navigation/MainNavigation";
import BodyRouter from "./comp_routes/BodyRouter";
import history from "./utils/history";

import "./App.css";
import "./styles/heroPattern.css";

class App extends Component {

  render() {
    return (
      <Router history={history}>
        <MainHeader />
        <BodyRouter />
      </Router>
    );
  }
}

export default App;
