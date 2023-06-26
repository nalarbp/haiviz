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
  setColorBySpecies,
  setColorByLocation,
  setColorBySourceType,
  setColorByProfile1,
  setColorByProfile2,
  setColorByProfile3,
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

  const grayColorScaleStateHandler = () => {
    grayColorScaleState(props.colorScale);
  };

  const resetColorScaleStateHandler = () => {
    resetColorScaleState(props.colorScale);
  };

  //FUNCTIONS
  function grayColorScaleState(scaleColor) {
    switch (scaleColor.colorType) {
      case "species":
        let species_col = _.cloneDeep(scaleColor.bySpecies);
        species_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorBySpecies(species_col);
        break;
      case "location":
        let location_col = _.cloneDeep(scaleColor.byLocation);
        location_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorByLocation(location_col);
        break;
      case "sourceType":
        let sourceType_col = _.cloneDeep(scaleColor.bySourceType);
        sourceType_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorBySourceType(sourceType_col);
        break;
      case "profile1":
        let profile1_col = _.cloneDeep(scaleColor.byProfile1);
        profile1_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorByProfile1(profile1_col);
        break;
      case "profile2":
        let profile2_col = _.cloneDeep(scaleColor.byProfile2);
        profile2_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorByProfile2(profile2_col);
        break;
      case "profile3":
        let profile3_col = _.cloneDeep(scaleColor.byProfile3);
        profile3_col.forEach((value, key, d) => {
          d.set(key, "#808080");
        });
        props.setColorByProfile3(profile3_col);
        break;
      default:
    }
  }
  function resetColorScaleState(scaleColor) {
    switch (scaleColor.colorType) {
      case "species":
        let species_col = _.cloneDeep(scaleColor.bySpecies_ori);
        props.setColorBySpecies(species_col);
        break;
      case "location":
        let location_col = _.cloneDeep(scaleColor.byLocation_ori);
        props.setColorByLocation(location_col);
        break;
      case "sourceType":
        let sourceType_col = _.cloneDeep(scaleColor.bySourceType_ori);
        props.setColorBySourceType(sourceType_col);
        break;
      case "profile1":
        let profile1_col = _.cloneDeep(scaleColor.byProfile1_ori);
        props.setColorByProfile1(profile1_col);
        break;
      case "profile2":
        let profile2_col = _.cloneDeep(scaleColor.byProfile2_ori);
        props.setColorByProfile2(profile2_col);
        break;
      case "profile3":
        let profile3_col = _.cloneDeep(scaleColor.byProfile3_ori);
        props.setColorByProfile3(profile3_col);
        break;
      default:
    }
  }

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
                closeDrawerHandler={closeDrawerHandler}
                selectedCategory={selectedCategory}
                setselectedCategory={setselectedCategory}
                grayColorScaleStateHandler={grayColorScaleStateHandler}
                resetColorScaleStateHandler={resetColorScaleStateHandler}
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
                setColorBySpecies={props.setColorBySpecies}
                setColorByLocation={props.setColorByLocation}
                setColorBySourceType={props.setColorBySourceType}
                setColorByProfile1={props.setColorByProfile1}
                setColorByProfile2={props.setColorByProfile2}
                setColorByProfile3={props.setColorByProfile3}
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
      deactivateChart: deactivateChart,
      changeColorResizeSignal: changeColorResizeSignal,
      changeIsColorScaleDownloading: changeIsColorScaleDownloading,
      setColorScaleType: setColorScaleType,
      setColorBySpecies: setColorBySpecies,
      setColorByLocation: setColorByLocation,
      setColorBySourceType: setColorBySourceType,
      setColorByProfile1: setColorByProfile1,
      setColorByProfile2: setColorByProfile2,
      setColorByProfile3: setColorByProfile3,
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
