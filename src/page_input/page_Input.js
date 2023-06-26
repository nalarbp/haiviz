import React, { useEffect } from "react";
import { Row, Col } from "antd";
import { connect } from "react-redux";
import "./style_input.css";
import InputPlaceholder from "./comp_InputPlaceholder";
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

const Input = (props) => {
  useEffect(() => {
  }, []);
  return (
    <Row>
      <Col>
        <InputPlaceholder />
      </Col>
    </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Input);
