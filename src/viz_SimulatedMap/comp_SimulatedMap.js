/* ============================================================================

============================================================================ */
import React, { useState, useEffect } from "react";
import SimulatedMapChart from "./chart_SimulatedMap_treemap";
import SimulatedMapSettings from "./comp_SimulatedMap_Settings.js";
import { Row, Col, Card, Button } from "antd";
import { connect } from "react-redux";
import withMeasure from "../hocs/withMeasure";
import { bindActionCreators } from "redux";
import { deactivateChart, setSelectedData } from "../action/index";
import {
  changeSimapResizeSignal,
  changeSimapNodeSize,
  changeSimapTextSize,
  changeSimapLayout,
  changeSimapIsLocTextShown,
} from "../action/simulatedMap_actions";
import {
  DragOutlined,
  CloseOutlined,
  RetweetOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { use } from "cytoscape";

const dimensions = ["width", "height"];

const SimulatedMap = (props) => {
  const [isUserRedraw, setisUserRedraw] = useState(false);
  const [isDrawerVisible, setisDrawerVisible] = useState(false);

  //USEEFFECTS
  useEffect(() => {
    //console.log("efect draw");
    if (isUserRedraw) {
      setisUserRedraw(false);
    }
  }, [isUserRedraw]);

  //HANDLERS
  const closeCardHandler = () => {
    props.deactivateChart(props.id);
    props.changeSimapResizeSignal(false);
  };
  const userRedrawHandler = (val) => {
    if (!isUserRedraw) {
      setisUserRedraw(true);
      props.changeSimapResizeSignal(false);
    }
  };
  const openDrawerHandler = () => {
    setisDrawerVisible(true);
  };
  const closeDrawerHandler = () => {
    setisDrawerVisible(false);
  };

  return (
    <React.Fragment>
      <div style={{ height: "100%" }}>
        <Card
          title={"Treemap"}
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
          <div id="localmap-drawer-settings">
            <SimulatedMapSettings
              isDrawerVisible={isDrawerVisible}
              closeDrawerHandler={closeDrawerHandler}
              simulatedmapSettings={props.simulatedmapSettings}
              changeSimapNodeSize={props.changeSimapNodeSize}
              changeSimapTextSize={props.changeSimapTextSize}
              changeSimapLayout={props.changeSimapLayout}
              changeSimapIsLocTextShown={props.changeSimapIsLocTextShown}
            />
          </div>
          {props.isolateData && (
            <SimulatedMapChart
              width={props.width}
              height={props.height}
              simulatedMap={props.simulatedMap}
              data={props.isolateData}
              setSelectedData={props.setSelectedData}
              selectedData={props.selectedData}
              isUserRedraw={isUserRedraw}
              simulatedmapSettings={props.simulatedmapSettings}
              colorScale={props.colorScale}
            />
          )}
        </Card>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    isolateData: state.isolateData,
    selectedData: state.selectedData,
    simulatedMap: state.simulatedMap,
    simulatedmapSettings: state.simulatedmapSettings,
    colorScale: state.colorScale,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      deactivateChart: deactivateChart,
      changeSimapResizeSignal: changeSimapResizeSignal,
      setSelectedData: setSelectedData,
      changeSimapNodeSize: changeSimapNodeSize,
      changeSimapTextSize: changeSimapTextSize,
      changeSimapLayout: changeSimapLayout,
      changeSimapIsLocTextShown: changeSimapIsLocTextShown,
    },
    dispatch
  );
}

const MeasuredSimulatedMap = withMeasure(dimensions)(SimulatedMap);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeasuredSimulatedMap);
