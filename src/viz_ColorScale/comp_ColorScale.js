/* ============================================================================

============================================================================ */
import React, { useState, useEffect } from "react";
import ColorScaleChart from "./chart_ColorScale";
import ColorScaleSettings from "./comp_ColorScale_Settings";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import withMeasure from "../hocs/withMeasure";
import "./style_ColorScale.css";
import * as constant from "../utils/constants";
import { Row, Col, Card, Button } from "antd";
import {
  deactivateChart,
  changeColorResizeSignal,
  changeIsColorScaleDownloading,
  setColorScaleType,
  setColorScale,
} from "../action/index";
import {
  DragOutlined,
  CloseOutlined,
  RetweetOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const dimensions = ["width", "height"];
const _ = require("lodash");

const ColorScale = (props) => {
  const [isUserRedraw, setisUserRedraw] = useState(false);
  const [isDrawerVisible, setisDrawerVisible] = useState(false);
  const init_colorScaleType = props.colorScale.colorType
    ? props.colorScale.colorType
    : "location";
  const [selectedCategory, setselectedCategory] = useState(init_colorScaleType);

  //Functions
  useEffect(() => {
    if (isUserRedraw) {
      setisUserRedraw(false);
    }
  }, [isUserRedraw]);

  useEffect(() => {
    if (selectedCategory) {
      props.setColorScaleType(selectedCategory);
    }
  }, [selectedCategory]);

  //HANDLERS
  const closeCardHandler = () => {
    props.deactivateChart(props.id);
    props.changeColorResizeSignal(false);
  };
  const userRedrawHandler = () => {
    if (!isUserRedraw) {
      setisUserRedraw(true);
      props.changeColorResizeSignal(false);
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
          title={"Color key"}
          bordered={true}
          headStyle={{ height: "50px", padding: "0 20px" }}
          style={{ height: "100%" }}
          bodyStyle={{ margin: "0px", padding: "5px" }}
          extra={
            <Row>
              <Col span={6}>
                <Button
                  title={constant.dragButtonTitle}
                  className="panelHeader"
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<DragOutlined />}
                ></Button>
              </Col>
              <Col span={6}>
                <Button
                  title={constant.redrawButtonTitle}
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<RetweetOutlined />}
                  onClick={userRedrawHandler}
                ></Button>
              </Col>
              <Col span={6}>
                <Button
                  title={constant.settingsButtonTitle}
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<SettingOutlined />}
                  onClick={openDrawerHandler}
                ></Button>
              </Col>
              <Col span={6}>
                <Button
                  title={constant.closeButtonTitle}
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
            <div id="colorscale-drawer-settings">
              <ColorScaleSettings
                isDrawerVisible={isDrawerVisible}
                colorScale={props.colorScale}
                closeDrawerHandler={closeDrawerHandler}
                selectedCategory={selectedCategory}
                setselectedCategory={setselectedCategory}
                changeIsColorScaleDownloading={
                  props.changeIsColorScaleDownloading
                }
              />
            </div>
            {props.isolateData && (
              <ColorScaleChart
                width={props.width}
                height={props.height}
                isolateData={props.isolateData}
                isUserRedraw={isUserRedraw}
                colorScale={props.colorScale}
                colorscaleSettings={props.colorscaleSettings}
                setColorScaleType={props.setColorScaleType}
                setColorScale={props.setColorScale}
                changeIsColorScaleDownloading={
                  props.changeIsColorScaleDownloading
                }
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
    colorscaleSettings: state.colorscaleSettings,
    colorScale: state.colorScale,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deactivateChart,
      changeColorResizeSignal,
      changeIsColorScaleDownloading,
      setColorScaleType,
      setColorScale,
    },
    dispatch
  );
}

const MeasuredColorScale = withMeasure(dimensions)(ColorScale);

export default connect(mapStateToProps, mapDispatchToProps)(MeasuredColorScale);

/*
<Button
  size={"small"}
  style={{ margin: "0 5px", border: "none" }}
  icon={<SettingOutlined />}
  onClick={openDrawerHandler}
></Button>
<Button
  size={"small"}
  style={{ margin: "0 5px", border: "none" }}
  icon={<DownloadOutlined />}
></Button>
*/
