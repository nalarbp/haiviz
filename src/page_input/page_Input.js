import React, { useEffect } from "react";
import { Row, Col, Button } from "antd";
import { connect } from "react-redux";
import "./style_input.css";
import InputPlaceholder from "./comp_InputPlaceholder";
import PreloadedDataset from "../page_all/comp_preloadedDataset";
import { bindActionCreators } from "redux";
import { changeNavLocation } from "../action/navigation_actions";

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
import * as constant from "../utils/constants";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Input = (props) => {
  const goToLink = (e) => {
    props.changeNavLocation(e.target.value);
  };

  useEffect(() => {}, []);
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
      <Row justify={"center"}>
        <Col id="inputfiles-header" xs={24} md={12} xxl={10}>
          <p style={{ fontSize: "30pt", marginBottom: "20px" }}>Input files</p>
          <p
            style={{
              fontSize: "12pt",
              paddingLeft: "10px",
              paddingRight: "10px",
              marginBottom: "5px",
            }}
          >
            To start using HAIviz, click or drag and drop your input file to the
            input button, or select from preloaded dataset options, and then go
            page &nbsp;
            <span>
              <Link to="/haiviz-spa">
                <Button
                  shape={"round"}
                  size={"small"}
                  value={"haivizApp"}
                  onClick={goToLink}
                  style={{
                    backgroundColor: "#1eb776",
                    color: "white",
                    fontSize: "11pt",
                    border: "none",
                  }}
                >
                  Dashboard
                </Button>
              </Link>
            </span>
            . &nbsp; <br /> Check out page &nbsp;
            <span>
              <Link to="/documentation">
                <Button
                  shape={"round"}
                  size={"small"}
                  value={"documentation"}
                  onClick={goToLink}
                  style={{
                    backgroundColor: "#787878",
                    color: "white",
                    fontSize: "11pt",
                    border: "none",
                  }}
                >
                  Documentation
                </Button>
              </Link>
            </span>
            &nbsp; for input file details and examples.
          </p>
        </Col>
      </Row>
      <Row justify={"center"}>
        <PreloadedDataset />
      </Row>
      <Row justify={"center"}></Row>
      <InputPlaceholder />
    </div>
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
      loadIsolateData,
      loadTransmissionData,
      loadTreeData,
      loadSimulatedMap,
      loadSVG,
      setColorScale,
      changeTreeResizeSignal,
      changeNavLocation,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Input);
