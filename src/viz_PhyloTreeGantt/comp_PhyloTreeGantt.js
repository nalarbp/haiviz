/* ============================================================================

============================================================================ */
import React, { useState, useEffect } from "react";
import PhyloTreeGanttChart from "./chart_PhyloTreeGantt";
import PhyloTreeGanttSettings from "./comp_PhyloTreeGantt_Settings";
import { hierarchy } from "d3-hierarchy";
import { Row, Col, Card, Button } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import withMeasure from "../hocs/withMeasure";
import { deactivateChart, setSelectedData } from "../action/index";
import {
  DragOutlined,
  CloseOutlined,
  RetweetOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  changeTreeGanttResizeSignal,
  changeTreeGanttTextSize,
  changeTreeGanttTextOffset,
} from "../action/phyloTreeGantt_actions";
import newickParse from "../utils/newick";

const dimensions = ["width", "height"];

const PhyloTreeGantt = (props) => {
  const [isUserRedraw, setisUserRedraw] = useState(false);
  const [isDrawerVisible, setisDrawerVisible] = useState(false);

  //DATA PREP
  const phylotreeNwk = newickParse(props.treeStr);
  const phylotreeData = hierarchy(phylotreeNwk, (d) => d.branchset).sum((d) =>
    d.branchset ? 0 : 1
  );

  // USEEFFECTS
  useEffect(() => {
    if (isUserRedraw) {
      setisUserRedraw(false);
    }
  }, [isUserRedraw]);

  //HANDLERS
  const closeCardHandler = () => {
    props.deactivateChart(props.id);
    props.changeTreeGanttResizeSignal(false);
  };
  const openDrawerHandler = () => {
    setisDrawerVisible(true);
  };
  const closeDrawerHandler = () => {
    setisDrawerVisible(false);
  };
  const userRedrawHandler = () => {
    if (!isUserRedraw) {
      setisUserRedraw(true);
      props.changeTreeGanttResizeSignal(false);
    }
  };

  //
  return (
    <React.Fragment>
      <div style={{ height: "100%" }}>
        <Card
          title={"Phylogenetic tree and Gantt chart"}
          bordered={true}
          headStyle={{ height: "50px", padding: "0 20px" }}
          style={{ height: "100%" }}
          bodyStyle={{ margin: "0px", padding: "5px" }}
          extra={
            <Row>
              <Col span={6}>
                <Button
                  className="panelHeader"
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<DragOutlined />}
                ></Button>
              </Col>
              <Col span={6}>
                <Button
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<RetweetOutlined />}
                  onClick={userRedrawHandler}
                ></Button>
              </Col>
              <Col span={6}>
                <Button
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<SettingOutlined />}
                  onClick={openDrawerHandler}
                ></Button>
              </Col>
              <Col span={6}>
                <Button
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<CloseOutlined />}
                  onClick={closeCardHandler}
                ></Button>
              </Col>
            </Row>
          }
        >
          <React.Fragment>
            <div id="phylotree-drawer-settings">
              <PhyloTreeGanttSettings
                isDrawerVisible={isDrawerVisible}
                closeDrawerHandler={closeDrawerHandler}
                phylotreeGanttSettings={props.phylotreeGanttSettings}
                changeTreeGanttTextSize={props.changeTreeGanttTextSize}
                changeTreeGanttTextOffset={props.changeTreeGanttTextOffset}
              />
            </div>
            {phylotreeData && props.movementData && (
              <PhyloTreeGanttChart
                width={props.width}
                height={props.height}
                isolateData={props.isolateData}
                phylotreeData={phylotreeData}
                movementData={props.movementData}
                isUserRedraw={isUserRedraw}
                phylotreeGanttSettings={props.phylotreeGanttSettings}
                selectedData={props.selectedData}
                setSelectedData={props.setSelectedData}
                colorScale={props.colorScale}
              />
            )}
          </React.Fragment>
        </Card>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    isolateData: state.isolateData,
    treeStr: state.tree,
    movementData: state.movementData,
    selectedData: state.selectedData,
    phylotreeGanttSettings: state.phylotreeGanttSettings,
    colorScale: state.colorScale,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deactivateChart: deactivateChart,
      changeTreeGanttResizeSignal: changeTreeGanttResizeSignal,
      changeTreeGanttTextSize: changeTreeGanttTextSize,
      changeTreeGanttTextOffset: changeTreeGanttTextOffset,
      setSelectedData: setSelectedData,
    },
    dispatch
  );
}

const MeasuredPhyloTreeGantt = withMeasure(dimensions)(PhyloTreeGantt);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeasuredPhyloTreeGantt);
