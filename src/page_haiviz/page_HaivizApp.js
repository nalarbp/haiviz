//import Dashboard from "./containers/cont_Dashboard";
//import Nav from "./containers/cont_Nav";

import React, { useEffect } from "react";
import { Row, Col } from "antd";
import { connect } from "react-redux";
import "./style_haivizapp.css";
import SideMenuNav from "./comp_SideMenuNav";
import Dashboard from "./comp_Dashboard";
import { bindActionCreators } from "redux";
import {
  loadIsolateData,
  loadTransmissionData,
  loadSVG,
  setColorScale,
} from "../action/index";
import { loadSimulatedMap } from "../action/simulatedMap_actions";
import {
  loadTreeData,
  changeTreeResizeSignal,
} from "../action/phyloTree_actions";

const HAIvizApp = (props) => {
  useEffect(() => {
    //load demo data
  }, []);
  return (
    <React.Fragment>
    <Row className="haiviz-row">
      <Col xs={4} sm={3} xl={2} id="haiviz-side-menu">
        <SideMenuNav activeChart={props.activeChart} />
      </Col>
      <Col xs={20} sm={21} xl={22} id="haiviz-side-dashboard">
        <Dashboard />
      </Col>
    </Row>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    activeChart: state.activeChart,
    layout: state.layout,
    isolateData: state.isolateData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadIsolateData: loadIsolateData,
      loadTransmissionData: loadTransmissionData,
      loadTreeData: loadTreeData,
      loadSimulatedMap: loadSimulatedMap,
      loadSVG: loadSVG,
      setColorScale: setColorScale,
      changeTreeResizeSignal: changeTreeResizeSignal,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HAIvizApp);

//Green of HAIvizApp #1eb776
