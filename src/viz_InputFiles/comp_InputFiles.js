import React, { useState } from "react";
import { Row, Col, Button, Modal, Input } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MetadataInput from "./btn_MetadataInput";
import LocalmapInput from "./btn_LocalmapInput";
import PhylotreeInput from "./btn_PhylotreeInput";
import TransgraphInput from "./btn_TransgraphInput";
import MovementInput from "./btn_MovementInput";
import * as constant from "../utils/constants";
import "./style_inputFiles.css";
import {
  loadIsolateData,
  loadSVG,
  loadTransmissionData,
  loadMovementData,
  setColorScale,
  setColorByLocation,
} from "../action/index";
import { loadSimulatedMap } from "../action/simulatedMap_actions";
import { loadTreeData } from "../action/phyloTree_actions";

const InputFIles = (props) => {
  return (
    <React.Fragment>
      <div style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
        <Row justify={"center"} style={{ margin: "0px" }}>
          <Col id="inputfiles-header" xs={24} md={20} xl={16} xxl={12}>
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

        <Row
          justify={"center"}
          gutter={[16, 16]}
          style={{ width: "80%", margin: "auto" }}
        >
          <Col xs={24} sm={12} md={11} xl={8} xxl={4} className="input-button">
            <MetadataInput
              isolateData={props.isolateData}
              loadIsolateData={props.loadIsolateData}
              setColorScale={props.setColorScale}
              loadSimulatedMap={props.loadSimulatedMap}
            />
          </Col>

          <Col xs={24} sm={12} md={11} xl={8} xxl={4} className="input-button">
            <LocalmapInput
              isolateData={props.isolateData}
              svgMap={props.svgMap}
              loadXML={props.loadXML}
            />
          </Col>

          <Col xs={24} sm={12} md={11} xl={8} xxl={4} className="input-button">
            <PhylotreeInput
              isolateData={props.isolateData}
              treeData={props.treeData}
              loadTreeData={props.loadTreeData}
            />
          </Col>
          <Col xs={24} sm={12} md={11} xl={8} xxl={4} className="input-button">
            <TransgraphInput
              isolateData={props.isolateData}
              transgraphData={props.transgraphData}
              loadTransgraphData={props.loadTransgraphData}
            />
          </Col>
          <Col xs={24} sm={12} md={11} xl={8} xxl={4} className="input-button">
            <MovementInput
              isolateData={props.isolateData}
              movementData={props.movementData}
              loadMovementData={props.loadMovementData}
              loadIsolateData={props.loadIsolateData}
              setColorByLocation={props.setColorByLocation}
            />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    isolateData: state.isolateData,
    svgMap: state.floorplan,
    treeData: state.tree,
    transgraphData: state.transmission,
    movementData: state.movementData,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      loadIsolateData: loadIsolateData,
      loadXML: loadSVG,
      loadTreeData: loadTreeData,
      loadTransgraphData: loadTransmissionData,
      loadMovementData: loadMovementData,
      setColorScale: setColorScale,
      setColorByLocation: setColorByLocation,
      loadSimulatedMap: loadSimulatedMap,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(InputFIles);

