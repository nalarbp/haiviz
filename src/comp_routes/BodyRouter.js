import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect, Route, Switch } from "react-router-dom";
import CreateMap from "../page_createMap/page_CreateMap";
import Documentation from "../page_documentation/page_Documentation";
import Preloaded from "../page_preloaded/page_Preloaded";
import Input from "../page_input/page_Input";
import Home from "../page_home/page_Home";
import HAIvizApp from "../page_haiviz/page_HaivizApp";
import * as constant from "../utils/constants";
import { readPreloadedDatasetJSON } from "../utils/utils";
import { preloadedDataToStore } from "../action/index";

const BodyRouter = (props) => {
  if (props.preloadedData === null) {
    readPreloadedDatasetJSON(
      constant.PRELOADED_DATA,
      props.preloadedDataToStore
    );
  }

  const init_routes = (
    <Switch>
      <Route exact path={"/"} component={Home} />
      <Route path={"/input"} component={Input} />
      <Route path={"/create-map"} component={CreateMap} />
      <Route path={"/haiviz-spa"} component={HAIvizApp} />
      <Route path={"/documentation"} component={Documentation} />
      <Redirect to="/" />
    </Switch>
  );

  const [routes, setRoutes] = useState(init_routes);

  useEffect(() => {
    if (props.preloadedData) {
      let preloadedData_ids = Array.from(props.preloadedData.keys());
      let new_routes = (
        <Switch>
          <Route exact path={"/"} component={Home} />
          <Route path={"/input"} component={Input} />
          <Route path={"/create-map"} component={CreateMap} />
          <Route path={"/haiviz-spa"} component={HAIvizApp} />
          <Route path={"/documentation"} component={Documentation} />
          {preloadedData_ids.map((id) => (
            <Route key={id} path={"/" + String(id)}>
              <Preloaded preloadedID={id} />
            </Route>
          ))}
          <Redirect to="/" />
        </Switch>
      );
      setRoutes(new_routes);
    }
  }, [props.preloadedData]);

  return (
    <React.Fragment>
      <main>{routes}</main>
    </React.Fragment>
  );
};

function mapStateToProps(state, ownProps) {
  return { preloadedData: state.preloadedData };
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      preloadedDataToStore,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(BodyRouter);
