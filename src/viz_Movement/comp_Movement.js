import React, { useState, useEffect } from "react";
import MovementChart from "./chart_Movement_gantt";
import MovementSettings from "./comp_Movement_Settings";
import { Row, Col, Card, Button } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import withMeasure from "../hocs/withMeasure";
import {
  DragOutlined,
  CloseOutlined,
  RetweetOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { deactivateChart, setSelectedData } from "../action/index";
import {
  changeMovementResizeSignal,
  changeMovementNodeSize,
  changeMovementTextSize,
  changeMovementTextOffset,
  changeIsOverlappingLineShown,
  changeIsOverlappingLineScaled,
  changeOverlappingLineScaleFactor,
  changeIsSortedBySuffix,
  changeSuffixSeparator,
  changeIsResort,
} from "../action/movementChart_actions";
import "./style_Movement.css";

const dimensions = ["width", "height"];

const PatientMovement = (props) => {
  const [isUserRedraw, setisUserRedraw] = useState(false);
  const [isDrawerVisible, setisDrawerVisible] = useState(false);

  // USEEFFECTS
  useEffect(() => {
    if (isUserRedraw) {
      setisUserRedraw(false);
    }
  }, [isUserRedraw]);

  //HANDLERS
  const closeCardHandler = () => {
    props.deactivateChart(props.id);
    props.changeMovementResizeSignal(false);
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
      props.changeMovementResizeSignal(false);
    }
  };

  return (
    <React.Fragment>
      <div style={{ height: "100%" }}>
        <Card
          title={"Gantt Chart"}
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
          <div id="movement-drawer-settings">
            <MovementSettings
              isDrawerVisible={isDrawerVisible}
              movementSettings={props.movementSettings}
              closeDrawerHandler={closeDrawerHandler}
              changeMovementNodeSize={props.changeMovementNodeSize}
              changeMovementTextSize={props.changeMovementTextSize}
              changeMovementTextOffset={props.changeMovementTextOffset}
              changeIsOverlappingLineShown={props.changeIsOverlappingLineShown}
              changeIsSortedBySuffix={props.changeIsSortedBySuffix}
              changeSuffixSeparator={props.changeSuffixSeparator}
              changeIsResort={props.changeIsResort}
              changeIsOverlappingLineScaled={
                props.changeIsOverlappingLineScaled
              }
              changeOverlappingLineScaleFactor={
                props.changeOverlappingLineScaleFactor
              }
            />
          </div>
          {props.movementData && (
            <MovementChart
              width={props.width}
              height={props.height}
              data={props.movementData}
              isolateData={props.isolateData}
              colorScale={props.colorScale}
              movementSettings={props.movementSettings}
              isUserRedraw={isUserRedraw}
              selectedData={props.selectedData}
              setSelectedData={props.setSelectedData}
            />
          )}
        </Card>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    movementData: state.movementData,
    isolateData: state.isolateData,
    colorScale: state.colorScale,
    selectedData: state.selectedData,
    movementSettings: state.movementSettings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deactivateChart: deactivateChart,
      changeMovementResizeSignal: changeMovementResizeSignal,
      changeMovementNodeSize: changeMovementNodeSize,
      changeMovementTextSize: changeMovementTextSize,
      changeMovementTextOffset: changeMovementTextOffset,
      setSelectedData: setSelectedData,
      changeIsOverlappingLineShown: changeIsOverlappingLineShown,
      changeIsOverlappingLineScaled: changeIsOverlappingLineScaled,
      changeOverlappingLineScaleFactor: changeOverlappingLineScaleFactor,
      changeIsSortedBySuffix: changeIsSortedBySuffix,
      changeSuffixSeparator: changeSuffixSeparator,
      changeIsResort: changeIsResort,
    },
    dispatch
  );
}

const MeasuredPatientMovement = withMeasure(dimensions)(PatientMovement);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeasuredPatientMovement);

/*
<Button
  size={"small"}
  style={{ margin: "0 5px", border: "none" }}
  icon={<DownloadOutlined />}
></Button>
*/
