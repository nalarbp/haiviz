import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  loadIsolateData,
  loadSVG,
  loadTransmissionData,
  loadMovementData,
  setColorScale,
  setColorByLocation,
  deactivateChart,
} from "../action/index";

import { loadSimulatedMap } from "../action/simulatedMap_actions";
import { loadTreeData } from "../action/phyloTree_actions";

const DeleteInput = (props) => {
  const removeInputHandler = () => {
    switch (props.id) {
      case "metadata":
        props.loadIsolateData(null);
        props.deactivateChart("summary");
        props.deactivateChart("idxCol");
        props.deactivateChart("simulatedMap");
        props.deactivateChart("bar");
        props.deactivateChart("table");
        break;
      case "map":
        props.loadXML(null);
        props.deactivateChart("floorplan");
        break;
      case "tree":
        props.loadTreeData(null);
        props.deactivateChart("tree");
        props.deactivateChart("treeGantt");
        break;
      case "network":
        props.loadTransgraphData(null);
        props.deactivateChart("transmission");
        break;
      case "gantt":
        props.loadMovementData(null);
        props.deactivateChart("gantt");
        props.deactivateChart("treeGantt");
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
        onClick={removeInputHandler}
      >
        <DeleteOutlined style={{ color: "red", fontSize: "10pt" }} />
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
      loadIsolateData,
      loadXML: loadSVG,
      loadTreeData,
      loadTransgraphData: loadTransmissionData,
      loadMovementData,
      setColorScale,
      setColorByLocation,
      loadSimulatedMap,
      deactivateChart,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteInput);
