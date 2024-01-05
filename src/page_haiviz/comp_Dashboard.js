import React from "react";
import ReactGridLayout, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import PatientMovement from "../viz_Movement/comp_Movement";
import DataTable from "../viz_DataTable/comp_DataTable";
import TransGraph from "../viz_TransGraph/comp_TransGraph";
import PhyloTree from "../viz_PhyloTree/comp_PhyloTree";
import PhyloTreeGantt from "../viz_PhyloTreeGantt/comp_PhyloTreeGantt";
import TemporalBar from "../viz_TemporalBar/comp_TemporalBar";
import Localmap from "../viz_Localmap/comp_Localmap";
import SummaryCard from "../viz_Summary/comp_Summary";
import SimulatedMap from "../viz_SimulatedMap/comp_SimulatedMap";
import ColorScale from "../viz_ColorScale/comp_ColorScale";
import PreloadedDataset from "../page_all/comp_preloadedDataset";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setLayout, changeColorResizeSignal } from "../action/index";
import { changeTransResizeSignal } from "../action/transGraph_actions";
import { changeMovementResizeSignal } from "../action/movementChart_actions";
import { changeSimapResizeSignal } from "../action/simulatedMap_actions";
import { changeTreeResizeSignal } from "../action/phyloTree_actions";
import { changeTempResizeSignal } from "../action/temporalBar_actions";
import { changeLocalmapResizeSignal } from "../action/localMap_actions";
import { changeTreeGanttResizeSignal } from "../action/phyloTreeGantt_actions";
import { Row, Empty } from "antd";
import _ from "lodash";
const GridLayout = WidthProvider(ReactGridLayout);

//const dimensions = ["width", "height"];
//const Mea = withMeasure(dimensions)(PatientMovement);

const Dashboard = (props) => {
  const layoutState = props.layout;
  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const layoutState_mode = vw < 768 ? "sm" : "md";
  const activeCharts = Object.keys(props.activeChart)
    .map((key) => {
      return { key: key, status: props.activeChart[key].show };
    })
    .filter((d) => {
      return d.status;
    });
 //use useEffect to prevent re-rendering when layoutState changes
  // useEffect(() => {
  //   console.log("Dashboard useEffect");
  //   console.log(layoutState);
  //   console.log(layoutState_mode);
  //   console.log(activeCharts);
  // }, [layoutState, layoutState_mode, activeCharts]);
  

// functions
  function createChart(id) {
    let newID = id.split("_");
    switch (newID[0]) {
      case "summary":
        return <SummaryCard id={id} />;
      case "gantt":
        return <PatientMovement id={id} />;
      case "idxCol":
        return <ColorScale id={id} />;
      case "floorplan":
        return <Localmap id={id} />;
      case "tree":
        return <PhyloTree id={id} />;
      case "transmission":
        return <TransGraph id={id} />;
      case "info":
        return <div>Info</div>;
      case "table":
        return <DataTable id={id} />;
      case "bar":
        return <TemporalBar id={id} />;
      case "simulatedMap":
        return <SimulatedMap id={id} />;
      case "overlappingTable":
        return <div>OverlappingTable</div>;
      case "ukulele":
        return <div>Ukulele</div>;
      case "treeGantt":
        return <PhyloTreeGantt id={id} />;
      default:
        return <div></div>;
    }
  }

  function getDataGrid(layoutState, id) {
    let dataGrid;
    switch (layoutState_mode) {
      case "sm":
        layoutState.sm.forEach(function(d) {
          if (d.i === id) {
            dataGrid = d;
          }
        });
        return dataGrid;
      case "md":
        layoutState.md.forEach(function(d) {
          if (d.i === id) {
            dataGrid = d;
          }
        });
        return dataGrid;
      default:
        layoutState.md.forEach(function(d) {
          if (d.i === id) {
            dataGrid = d;
          }
        });
        return dataGrid;
    }
  }

  function onLayoutChangeHandler(changingLayout) {
    let newLayoutState = _.cloneDeep(layoutState);
    changingLayout.forEach(function(d) {
      let windowID = d.i;
      let windowLayout = d;
      if(layoutState_mode === "sm"){
        newLayoutState.sm.forEach(function(d) {
          if (d.i === windowID) {
            Object.keys(windowLayout).forEach(function(key) {
              d[key] = windowLayout[key];
            });
          }
        });
      }
      else{
        newLayoutState.md.forEach(function(d) {
          if (d.i === windowID) {
            Object.keys(windowLayout).forEach(function(key) {
              d[key] = windowLayout[key];
            });
          }
        });
      }
    });
    props.setLayout(newLayoutState);
  }

  function onResizeStartHandler(layout,
    layoutItem
  ) {
    let chartIdx = layoutItem.i;
    switch (chartIdx) {
      case "tree":
        props.changeTreeResizeSignal(true);
        break;
      case "simulatedMap":
        props.changeSimapResizeSignal(true);
        break;
      case "transmission":
        props.changeTransResizeSignal(true);
        break;
      case "idxCol":
        props.changeColorResizeSignal(true);
        break;
      case "floorplan":
        props.changeLocalmapResizeSignal(true);
        break;
      case "gantt":
        props.changeMovementResizeSignal(true);
        break;
      case "bar":
        props.changeTempResizeSignal(true);
        break;
      case "treeGantt":
        props.changeTreeGanttResizeSignal(true);
        break;
      default:
        return;
    }
  }


  //inside GridLayout you need multiple div with data-grid and inside the div you put your chart

  return (
    <React.Fragment>
      <Row justify={"center"}>
        <PreloadedDataset />
      </Row>
      {activeCharts.length === 0 && (
        <Empty description={"Click any active icon to create chart."} />
      )}
      {activeCharts.length > 0 && (
        <div id="dashboard">
          <GridLayout
            cols={12}
            rowHeight={30}
            margin={[3, 3]}
            onResizeStart={onResizeStartHandler}
            onLayoutChange={onLayoutChangeHandler}
            draggableHandle=".panelHeader"
          >
            {activeCharts.map(function(d, idx) {
              return (
                <div key={d.key} data-grid={getDataGrid(layoutState, d.key)}>
                  {createChart(d.key)}
                </div>
              );
            })}
          </GridLayout>
        </div>
      )}
    </React.Fragment>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    activeChart: state.activeChart,
    layout: state.layout,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      changeTreeResizeSignal: changeTreeResizeSignal,
      changeSimapResizeSignal: changeSimapResizeSignal,
      changeTransResizeSignal: changeTransResizeSignal,
      changeColorResizeSignal: changeColorResizeSignal,
      changeLocalmapResizeSignal: changeLocalmapResizeSignal,
      changeMovementResizeSignal: changeMovementResizeSignal,
      changeTempResizeSignal: changeTempResizeSignal,
      changeTreeGanttResizeSignal: changeTreeGanttResizeSignal,
      setLayout: setLayout,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
