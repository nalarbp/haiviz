import React, { useState } from "react";
import { Row, Col, Button } from "antd";
import { bindActionCreators } from "redux";
import "./style_Preloaded.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { changeNavLocation } from "../action/navigation_actions";
import { loadSimulatedMap } from "../action/simulatedMap_actions";
import { loadTreeData } from "../action/phyloTree_actions";
import {
  getIsolateData,
  parseXML,
  parseTree,
  parseGraph,
  parseMovement,
} from "../utils/utils";
import {
  selectedPreloadedDataToStore,
  loadIsolateData,
  loadSVG,
  loadTransmissionData,
  loadMovementData,
  setColorScale,
  deactivateChartMulti,
  resetStore,
} from "../action/index";

const Preloaded = (props) => {
  const setisLoading = () => {}; //dummy function, to match drag and drop button functions

  const getTitleDesc = (option) => {
    if (props.preloadedData) {
      if (props.preloadedID) {
        let projectData = props.preloadedData.get(props.preloadedID);
        if (projectData) {
          if (option === "title") {
            return projectData.name;
          } else if (option === "desc") {
            return projectData.description;
          }
        }
      }
    }
  };

  const showcaseViewHandler = (e) => {
    let val = props.preloadedID;
    if (props.preloadedData && val) {
      props.resetStore();
      //load a new one
      let projectData = props.preloadedData.get(val);
      console.log(projectData);
      //for each input (metadata, map, tree, network, and gantt), read the file and load it
      //metadata
      if (projectData.metadata) {
        getIsolateData(
          projectData.metadata,
          props.loadIsolateData,
          props.setColorScale,
          props.loadSimulatedMap,
          setisLoading
        );
      }
      //map
      if (projectData.map) {
        parseXML(projectData.map, props.loadXML);
      }
      //tree
      if (projectData.tree) {
        parseTree(projectData.tree, props.loadTreeData, setisLoading);
      }
      //network
      if (projectData.network) {
        parseGraph(projectData.network, props.loadTransgraphData, setisLoading);
      }
      //gantt
      if (projectData.gantt) {
        parseMovement(projectData.gantt, props.loadMovementData, setisLoading);
      }

      props.selectedPreloadedDataToStore(val);
      props.deactivateChartMulti();
      props.changeNavLocation("haivizApp");
    } else {
      props.resetStore();
    }
  };

  return (
    <React.Fragment>
      <Row justify={"center"} style={{ margin: "0px 20px" }}>
        <Col xs={24} md={18} xl={14} xxl={10}>
          <p style={{ fontSize: "22pt", marginBottom: "20px" }}>
            Dataset {props.preloadedID}
          </p>
          <p style={{ fontSize: "14pt", marginBottom: "5px" }}>
            Title: {getTitleDesc("title")}
          </p>
          <p style={{ fontSize: "14pt", marginBottom: "25px" }}>
            Description: {getTitleDesc("desc")}
          </p>
          <br />
          <Link to="/haiviz-spa">
            <Button
              type="primary"
              onClick={showcaseViewHandler}
              icon={<UploadOutlined />}
            >
              Load this dataset to dashboard
            </Button>
          </Link>
        </Col>
      </Row>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    preloadedData: state.preloadedData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadIsolateData,
      loadXML: loadSVG,
      loadTreeData,
      loadTransgraphData: loadTransmissionData,
      loadMovementData,
      setColorScale,
      loadSimulatedMap,
      selectedPreloadedDataToStore,
      resetStore,
      changeNavLocation,
      deactivateChartMulti,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Preloaded);
