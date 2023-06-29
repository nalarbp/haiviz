import React, { useEffect } from "react";
import { Row, Col, Button } from "antd";
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
import * as constant from "../utils/constants";

const Input = (props) => {
  useEffect(() => {
  }, []);
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
    <Row justify={"center"}>
          <Col id="inputfiles-header" xs={24} md={12} xxl={10}>
            <p style={{ fontSize: "32pt", marginBottom: "20px" }}>
              Input files
            </p>
            <p style={{ fontSize: "12pt", paddingLeft: '10px', paddingRight: '10px', marginBottom: "5px" }}>
              Click the input button or drag your file(s) into the input area to
              start using HAIviz. To create the input files, check our
              documentation page, or click &nbsp;
              <span>
                <Button
                  shape={"round"}
                  size={"small"}
                  href={constant.TEMPLATE.bundled}
                  style={{
                    backgroundColor: "#1eb776",
                    color: "white",
                    fontSize: "11pt",
                    border: "none",
                  }}
                >
                  here
                </Button>
              </span>
              &nbsp; to download example files.
            </p>
          </Col>
        </Row>
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
