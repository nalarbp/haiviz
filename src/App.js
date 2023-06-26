import React, { Component } from "react";
import {
  Redirect,
  Route,
  Router,
  Switch
} from "react-router-dom";
import "./App.css";
import MainHeader from "./comp_navigation/MainNavigation";
import CreateMap from "./page_createMap/page_CreateMap";
import Documentation from "./page_documentation/page_Documentation";
import Input from "./page_input/page_Input";
import HAIvizApp from "./page_haiviz/page_HaivizApp";
import Home from "./page_home/page_Home";

import history from "./utils/history";

class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route exact path={"/"} component={Home} />
        <Route path={"/input"} component={Input} />
        <Route path={"/create-map"} component={CreateMap} />
        <Route path={"/haiviz-spa"} component={HAIvizApp} />
        <Route path={"/documentation"} component={Documentation} />

        <Redirect to="/" />
      </Switch>
    );
    return (
      <Router history={history}>
        <MainHeader />
        <main>{routes}</main>
      </Router>
    );
  }
}

export default App;
