import React, { useState } from "react";
import { Row, Col, Button, Modal, Input } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MetadataInput from "../viz_InputFiles/btn_MetadataInput";
import LocalmapInput from "../viz_InputFiles/btn_LocalmapInput";
import PhylotreeInput from "../viz_InputFiles/btn_PhylotreeInput";
import TransgraphInput from "../viz_InputFiles/btn_TransgraphInput";
import MovementInput from "../viz_InputFiles/btn_MovementInput";
import "./style_input.css";
import {
  loadIsolateData,
  loadSVG,
  loadTransmissionData,
  loadMovementData,
  setColorScale,
} from "../action/index";
import { loadSimulatedMap } from "../action/simulatedMap_actions";
import { loadTreeData } from "../action/phyloTree_actions";

const InputPlaceholder = (props) => {
  return (
    <React.Fragment>
      
        <Row
          justify={"center"}
          gutter={[16, 16]}
          style={{ width: "80%", margin: "auto" }}
        >
          <Col xs={24} sm={8} md={8} lg={4} className="input-button">
            <MetadataInput
              isolateData={props.isolateData}
              loadIsolateData={props.loadIsolateData}
              setColorScale={props.setColorScale}
              loadSimulatedMap={props.loadSimulatedMap}
            />
          </Col>

          <Col xs={24} sm={8} md={8} lg={4} className="input-button">
            <LocalmapInput
              isolateData={props.isolateData}
              svgMap={props.svgMap}
              loadXML={props.loadXML}
            />
          </Col>

          <Col xs={24} sm={8} md={8} lg={4} className="input-button">
            <PhylotreeInput
              isolateData={props.isolateData}
              treeData={props.treeData}
              loadTreeData={props.loadTreeData}
            />
          </Col>
          <Col xs={24} sm={8} md={8} lg={4} className="input-button">
            <TransgraphInput
              isolateData={props.isolateData}
              transgraphData={props.transgraphData}
              loadTransgraphData={props.loadTransgraphData}
            />
          </Col>
          <Col xs={24} sm={8} md={8} lg={4} className="input-button">
            <MovementInput
              isolateData={props.isolateData}
              movementData={props.movementData}
              loadMovementData={props.loadMovementData}
              loadIsolateData={props.loadIsolateData}
            />
          </Col>
        </Row>
      
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
      loadSimulatedMap: loadSimulatedMap,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(InputPlaceholder);

