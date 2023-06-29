import React from "react";
import {DeleteOutlined } from "@ant-design/icons";
import { Button} from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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


const DeleteInput = (props) => {


  const removeInputHandler = () => {
    switch (props.id) {
      case "metadata":
        props.loadIsolateData(null);
        break;
      case "map":
        props.loadXML(null);
        break;
      case "tree":
        props.loadTreeData(null);
        break;
      case "network":
        props.loadTransgraphData(null);
        break;
      case "gantt":
        props.loadMovementData(null);
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <Button
                    title={"Remove loaded input file"}
                    type={"ghost"}
                    style={{ backgroundColor: "transparent" }}
                    shape={"circle"}
                    size={"small"}
                    onClick={removeInputHandler}>
                    <DeleteOutlined style={{ color:"red", fontSize: "10pt" }}/>
                  </Button>

      
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteInput);


