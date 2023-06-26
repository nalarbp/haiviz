/* ============================================================================

============================================================================ */
import React from "react";
import { Col } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setActiveChart } from "../action/index";

//================================= ICON =======================================
import icon_gantt from "../img/icon_gantt.png";
import icon_gantt_inactive from "../img/icon_gantt_inactive.png";
import icon_transmission from "../img/icon_trans.png";
import icon_transmission_inactive from "../img/icon_trans_inactive.png";
import icon_floorplan from "../img/icon_floorplan.png";
import icon_floorplan_inactive from "../img/icon_floorplan_inactive.png";
import icon_tree from "../img/icon_tree.png";
import icon_tree_inactive from "../img/icon_tree_inactive.png";
import icon_table from "../img/icon_table.png";
import icon_table_inactive from "../img/icon_table_inactive.png";
import icon_bar from "../img/icon_bar.png";
import icon_bar_inactive from "../img/icon_bar_inactive.png";
import icon_colorpal from "../img/icon_colorpal_active.png";
import icon_colorpal_inactive from "../img/icon_colorpal_inactive.png";
import icon_simulatedMap from "../img/icon_simulatedMap.png";
import icon_simulatedMap_inactive from "../img/icon_simulatedMap_inactive.png";
import icon_summary from "../img/icon_summary_active.png";
import icon_summary_inactive from "../img/icon_summary_inactive.png";
import icon_tree_gantt from "../img/icon_tree_gantt_active.png";
import icon_tree_gantt_inactive from "../img/icon_tree_gantt_inactive.png";
//============================================================================

const SideMenuButton = (props) => {
  //return one button
  const btnAttributes = {
    title: getbuttonTitle(props.id),
    icon: getbuttonIcon(props.id),
    isDisabled: getisDisabled(props.id),
  };

  //Functions
  function onClickHandler() {
    props.setActiveChart(props.id);
  }
  function getisDisabled(id) {
    switch (id) {
      case "summary":
        return props.isolateData ? false : true;
      case "gantt":
        return props.movementData ? false : true;
      case "floorplan":
        return props.svgMap ? false : true;
      case "transmission":
        return props.transGraph ? false : true;
      case "tree":
        return props.phyloTree ? false : true;
      case "table":
        return props.isolateData ? false : true;
      case "bar":
        return props.isolateData ? false : true;
      case "simulatedMap":
        return props.isolateData ? false : true;
      case "idxCol":
        return props.isolateData ? false : true;
      case "treeGantt":
        return props.phyloTree && props.movementData ? false : true;
      default:
        return true;
    }
  }
  function getbuttonTitle(key) {
    switch (key) {
      case "summary":
        return "Dataset summary";
      case "gantt":
        return "Outbreak timeline";
      case "floorplan":
        return "Uploaded map";
      case "transmission":
        return "Transmission graph";
      case "tree":
        return "Phylogenetic tree";
      case "table":
        return "Metadata table";
      case "bar":
        return "Bar chart";
      case "simulatedMap":
        return "Simulated Map";
      case "idxCol":
        return "Color";
      case "treeGantt":
        return "Tree and Gantt chart";
      default:
        return "HAIviz";
    }
  }
  function getbuttonIcon(key) {
    switch (key) {
      case "summary":
        if (!props.isolateData) {
          return icon_summary_inactive;
        } else {
          return icon_summary;
        }
      case "gantt":
        if (!props.movementData) {
          return icon_gantt_inactive;
        } else {
          return icon_gantt;
        }
      case "transmission":
        if (!props.transGraph) {
          return icon_transmission_inactive;
        } else {
          return icon_transmission;
        }
      case "idxCol":
        if (!props.isolateData) {
          return icon_colorpal_inactive;
        } else {
          return icon_colorpal;
        }
      case "tree":
        if (!props.phyloTree) {
          return icon_tree_inactive;
        } else {
          return icon_tree;
        }
      case "table":
        if (!props.isolateData) {
          return icon_table_inactive;
        } else {
          return icon_table;
        }
      case "bar":
        if (!props.isolateData) {
          return icon_bar_inactive;
        } else {
          return icon_bar;
        }
      case "simulatedMap":
        if (!props.isolateData) {
          return icon_simulatedMap_inactive;
        } else {
          return icon_simulatedMap;
        }
      case "treeGantt":
        if (props.movementData && props.phyloTree && props.isolateData) {
          return icon_tree_gantt;
        } else {
          return icon_tree_gantt_inactive;
        }
      case "floorplan":
        if (!props.svgMap) {
          return icon_floorplan_inactive;
        } else {
          return icon_floorplan;
        }

      default:
        return icon_floorplan;
    }
  }

  return (
    <React.Fragment>
      <Col xs={24} className="haiviz-menu-icon">
        <button
          title={btnAttributes.title}
          onClick={onClickHandler}
          className="haiviz-button-icon"
          disabled={btnAttributes.isDisabled}
        >
          <img
            className="haiviz-img-responsive"
            alt={btnAttributes.title}
            src={btnAttributes.icon}
          ></img>
        </button>
      </Col>
    </React.Fragment>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    isolateData: state.isolateData,
    svgMap: state.floorplan,
    locationData: true,
    phyloTree: state.tree,
    transGraph: state.transmission,
    movementData: state.movementData,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      setActiveChart: setActiveChart,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenuButton);
