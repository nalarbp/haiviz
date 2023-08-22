import { Select } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as constant from "../utils/constants";
import { readPreloadedDatasetJSON, getIsolateData } from "../utils/utils";
import {
  preloadedDataToStore,
  selectedPreloadedDataToStore,
  loadIsolateData,
  loadSVG,
  loadTransmissionData,
  loadMovementData,
  setColorScale,
  resetStore,
} from "../action/index";
import { loadSimulatedMap } from "../action/simulatedMap_actions";
import { loadTreeData } from "../action/phyloTree_actions";
import "./style_commonComp.css";
import { parseXML, parseTree, parseGraph, parseMovement } from "../utils/utils";

const { Option } = Select;
const PreloadedDataset = (props) => {
  let data_options = [];
  let setisLoading = () => {}; //dummy function, to match drag and drop button functions

  //RETRIEVE PRELOADED_DATASET.JSON
  if (props.preloadedData === null) {
    readPreloadedDatasetJSON(
      constant.PRELOADED_DATA,
      props.preloadedDataToStore
    );
  }

  //List preloaded dataset and create as options
  if (props.preloadedData) {
    props.preloadedData.forEach((v, k) => {
      data_options.push(
        <Option key={k} value={k}>
          {v.name}
        </Option>
      );
    });
  }

  const selectPreloadedDataHandler = (val) => {
    if (props.preloadedData && val) {
      props.resetStore();
      //load a new one
      let projectData = props.preloadedData.get(val);

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
        console.log("gantt", projectData.gantt);
        parseMovement(projectData.gantt, props.loadMovementData, setisLoading);
      }

      props.selectedPreloadedDataToStore(val);
    } else {
      props.resetStore();
    }
  };
  //functions

  return (
    <React.Fragment>
      <Select
        value={props.selectedPreloadedData}
        onChange={selectPreloadedDataHandler}
        className={"haiviz-preloaded-select"}
      >
        {data_options}
      </Select>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    preloadedData: state.preloadedData,
    selectedPreloadedData: state.selectedPreloadedData,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      preloadedDataToStore,
      selectedPreloadedDataToStore,
      loadIsolateData,
      loadXML: loadSVG,
      loadTreeData,
      loadTransgraphData: loadTransmissionData,
      loadMovementData,
      setColorScale,
      loadSimulatedMap,
      resetStore,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PreloadedDataset);
