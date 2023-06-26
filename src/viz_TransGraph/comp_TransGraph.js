/* ============================================================================
//
============================================================================ */
import React, { useState, useEffect } from "react";
import TransGraph from "./chart_TransGraph_cytoscape";
import TransGraphHost from "./chart_TransGraph_cytoscape_host";
import TransmissionGraphSettings from "./comp_TransGraph_Settings";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import withMeasure from "../hocs/withMeasure";
import { Row, Col, Card, Button, Empty } from "antd";
import {
  DragOutlined,
  CloseOutlined,
  RetweetOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { deactivateChart, setSelectedData } from "../action/index";
import {
  changeTransResizeSignal,
  changeTransNodeSize,
  changeTransTextSize,
  changeTransTextOffset,
  changeTransIsDownloading,
  changeTransLayoutKey,
  changeTransIsLinkLabelShown,
  changeTransisUserStyleApplied,
  changeTransisLinkWeightApplied,
  changeTransLinkFactor,
} from "../action/transGraph_actions";

const dimensions = ["width", "height"];

const TransmissionGraph = (props) => {
  const [isUserRedraw, setisUserRedraw] = useState(false);
  const [isDrawerVisible, setisDrawerVisible] = useState(false);

  // USEEFFECTS
  useEffect(() => {
    //console.log(isUserRedraw);
    if (isUserRedraw) {
      setisUserRedraw(false);
    }
  }, [isUserRedraw]);

  //HANDLERS
  const closeCardHandler = () => {
    props.deactivateChart(props.id);
    props.changeTransResizeSignal(false);
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
      props.changeTransResizeSignal(false);
    }
  };

  return (
    <React.Fragment>
      <div style={{ height: "100%" }}>
        <Card
          title={"Graph (Network)"}
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
                {" "}
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
          <div id="transgraph-drawer-settings">
            <TransmissionGraphSettings
              isolateData={props.isolateData}
              data={props.transmissionData.graphData}
              isDrawerVisible={isDrawerVisible}
              closeDrawerHandler={closeDrawerHandler}
              transgraphSettings={props.transgraphSettings}
              changeTransNodeSize={props.changeTransNodeSize}
              changeTransTextSize={props.changeTransTextSize}
              changeTransTextOffset={props.changeTransTextOffset}
              changeTransLayoutKey={props.changeTransLayoutKey}
              changeTransIsLinkLabelShown={props.changeTransIsLinkLabelShown}
              changeTransLinkFactor={props.changeTransLinkFactor}
              changeTransisUserStyleApplied={
                props.changeTransisUserStyleApplied
              }
              changeTransisLinkWeightApplied={
                props.changeTransisLinkWeightApplied
              }
              changeTransIsDownloading={props.changeTransIsDownloading}
            />
          </div>
          {props.transmissionData.graphData &&
            props.transmissionData.graphKey === "isolate" && (
              <TransGraph
                width={props.width}
                height={props.height}
                data={props.transmissionData.graphData}
                isUserRedraw={isUserRedraw}
                transgraphSettings={props.transgraphSettings}
                selectedData={props.selectedData}
                setSelectedData={props.setSelectedData}
                colorScale={props.colorScale}
                isolateData={props.isolateData}
                changeTransIsDownloading={props.changeTransIsDownloading}
              />
            )}
          {props.transmissionData.graphData &&
            props.transmissionData.graphKey === "host" && (
              <TransGraphHost
                width={props.width}
                height={props.height}
                data={props.transmissionData.graphData}
                isUserRedraw={isUserRedraw}
                transgraphSettings={props.transgraphSettings}
                selectedData={props.selectedData}
                setSelectedData={props.setSelectedData}
                colorScale={props.colorScale}
                isolateData={props.isolateData}
                changeTransIsDownloading={props.changeTransIsDownloading}
              />
            )}
          {props.transmissionData.graphData &&
            !props.transmissionData.graphKey && (
              <React.Fragment>
                <div id="transgraph-invalid-graph">
                  <Empty
                    description={
                      "Invalid graph type: More than 20% node's label are neither isolate name nor source name. Please restart HAIviz and load a valid graph input"
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              </React.Fragment>
            )}
        </Card>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    transmissionData: state.transmission,
    selectedData: state.selectedData,
    transgraphSettings: state.transgraphSettings,
    colorScale: state.colorScale,
    isolateData: state.isolateData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deactivateChart: deactivateChart,
      changeTransResizeSignal: changeTransResizeSignal,
      changeTransNodeSize: changeTransNodeSize,
      changeTransTextSize: changeTransTextSize,
      changeTransTextOffset: changeTransTextOffset,
      setSelectedData: setSelectedData,
      changeTransIsDownloading: changeTransIsDownloading,
      changeTransLayoutKey: changeTransLayoutKey,
      changeTransIsLinkLabelShown: changeTransIsLinkLabelShown,
      changeTransisUserStyleApplied: changeTransisUserStyleApplied,
      changeTransLinkFactor: changeTransLinkFactor,
      changeTransisLinkWeightApplied: changeTransisLinkWeightApplied,
    },
    dispatch
  );
}

const MeasuredTransmissionGraph = withMeasure(dimensions)(TransmissionGraph);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeasuredTransmissionGraph);

/*
<Button
  size={"small"}
  style={{ margin: "0 5px", border: "none" }}
  icon={<DownloadOutlined />}
></Button>
<p>Link's weight threshold</p>
<Slider
  id={"transgraph-change-linkThreshold"}
  min={-1}
  max={25}
  step={1}
  onChange={linkThresholdHandler}
  defaultValue={props.transgraphSettings.transgraphIsDownloading}
></Slider>
*/
