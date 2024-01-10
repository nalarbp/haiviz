/* ============================================================================

============================================================================ */
import React, { useEffect, useState } from "react";
import TemporalHistogram from "./chart_TemporalBar_histogram";
import TemporalStackedBar from "./chart_TemporalBar_stackedBar";
import { Card, Button, Drawer, Row, Col, Select } from "antd";
import { deactivateChart, setSelectedData } from "../action/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  dateToStringIS08601,
  downloadSVG,
  getColumnNameByColorType,
} from "../utils/utils";
import { group, rollup } from "d3-array";
import withMeasure from "../hocs/withMeasure";
import "./style_TemporalBar.css";
import {
  DragOutlined,
  CloseOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  changeTempResizeSignal,
  changeTempChartMode,
  changeTempScaleMode,
} from "../action/temporalBar_actions";

const dimensions = ["width", "height"];
const moment = require("moment");
const _ = require("lodash");
const { Option } = Select;

const TemporalBar = (props) => {
  const [histogramData, sethistogramData] = useState(null);
  const [stackedBarData, setstackedBarData] = useState(null);
  const isolateData = _.cloneDeep(Array.from(props.isolateData.values()));
  const [isUserRedraw, setisUserRedraw] = useState(false);
  const [isDrawerVisible, setisDrawerVisible] = useState(false);
  const chartMode = props.temporalbarSettings.chartMode;
  const scaleMode = props.temporalbarSettings.scaleMode;
  const chartModeText = chartMode === "histogram" ? "Histogram" : "Stacked Bar";
  const scaleModeText = scaleMode === "daily" ? "Daily" : "Weekly";

  useEffect(() => {
    if (chartMode === "histogram") {
      switch (scaleMode) {
        case "daily":
          const isolateColDate_dayCount = group(isolateData, (d) =>
            dateToStringIS08601(d.isolate_colDate)
          );
          sethistogramData(isolateColDate_dayCount);
          break;
        case "weekly":
          const isolateColDate_weekCount = group(isolateData, (d) =>
            moment(d.isolate_colDate).format("YYYY[W]WW")
          );
          sethistogramData(isolateColDate_weekCount);
          break;
        default:
          break;
      }
    } else {
      switch (scaleMode) {
        case "daily":
          const colDateGroup_daily = group(isolateData, (d) =>
            dateToStringIS08601(d.isolate_colDate)
          );
          //sort them
          setstackedBarData(colDateGroup_daily);
          break;
        case "weekly":
          const colDateGroup_weekly = group(isolateData, (d) =>
            moment(d.isolate_colDate).format("GGGG[W]WW")
          );
          //sort them here
          const tallyGroup = rollup(
            isolateData,
            (v) => v.length,
            (d) => getColumnNameByColorType(d, props.colorScale.colorType)
          );

          const sorted_obj = {};
          const tallyGroup_sorted = new Map(
            [...tallyGroup.entries()].sort((a, b) => b[1] - a[1])
          );
          let idx = 1;
          tallyGroup_sorted.forEach((v, k) => {
            sorted_obj[k] = idx;
            idx++;
          });

          //make new map and sort it out
          let colDateGroup_weekly_sorted = new Map();
          colDateGroup_weekly.forEach((v, k) => {
            let v_sorted = v.sort((a, b) => {
              let a_rec = getColumnNameByColorType(
                a,
                props.colorScale.colorType
              );
              let b_rec = getColumnNameByColorType(
                b,
                props.colorScale.colorType
              );
              return sorted_obj[a_rec] - sorted_obj[b_rec];
            });

            colDateGroup_weekly_sorted.set(k, v_sorted);
          });

          // const colDateGroup_weekly_sorted = new Map(
          //   [...colDateGroup_weekly.entries()].sort((a, b) => {
          //     console.log(a);
          //     let a_rec = 1;
          //     //a[1][
          //     //  getColumnNameByColorType(a), props.colorScale.colorType)
          //     //]
          //     let b_rec = 2;
          //     return sorted_obj[a_rec] - sorted_obj[b_rec];
          //   })
          // );

          //console.log(colDateGroup_weekly_sorted);
          setstackedBarData(colDateGroup_weekly_sorted);
          break;
        default:
          break;
      }
    }
  }, [chartMode, scaleMode]);

  //USEEFFECTS
  useEffect(() => {
    //console.log("efect draw");
    if (isUserRedraw) {
      setisUserRedraw(false);
    }
  }, [isUserRedraw]);

  //HANDLERS
  const downloadSVGHandler = () => {
    downloadSVG("temporalbar-svg");
  };
  const closeCardHandler = () => {
    props.deactivateChart(props.id);
    props.changeTempResizeSignal(false);
  };
  const openDrawerHandler = () => {
    setisDrawerVisible(true);
  };
  const closeDrawerHandler = () => {
    setisDrawerVisible(false);
  };
  const setChartModeHandler = (val) => {
    props.changeTempChartMode(val);
  };
  const setScaleModeHandler = (val) => {
    props.changeTempScaleMode(val);
  };

  return (
    <React.Fragment>
      <div style={{ height: "100%" }}>
        <Card
          title={"Epidemic Curve"}
          bordered={true}
          headStyle={{ height: "50px", padding: "0 20px" }}
          style={{ height: "100%" }}
          bodyStyle={{ margin: "0px", padding: "5px" }}
          extra={
            <Row>
              <Col span={8}>
                <Button
                  className="panelHeader"
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<DragOutlined />}
                ></Button>
              </Col>
              <Col span={8}>
                <Button
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<SettingOutlined />}
                  onClick={openDrawerHandler}
                ></Button>
              </Col>
              <Col span={8}>
                {" "}
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
          <div id="temporalbar-drawer-settings">
            <Drawer
              title="Settings"
              placement="right"
              closable={true}
              onClose={closeDrawerHandler}
              visible={isDrawerVisible}
              getContainer={true}
            >
              <Row justify={"center"} gutter={[1, 16]}>
                <Col span={24}>
                  <p className="temporalbar-drawer-settings-p">Chart mode</p>
                  <Select
                    style={{ width: "100%" }}
                    placeholder={chartModeText}
                    onChange={setChartModeHandler}
                  >
                    <Option value="stackedBar">Stacked bar</Option>
                    <Option value="histogram">Histogram</Option>
                  </Select>
                </Col>
                <Col span={24}>
                  <p className="temporalbar-drawer-settings-p">Time scale</p>
                  <Select
                    style={{ width: "100%" }}
                    placeholder={scaleModeText}
                    onChange={setScaleModeHandler}
                  >
                    <Option value="daily">Daily</Option>
                    <Option value="weekly">Weekly</Option>
                  </Select>
                </Col>
                <Col span={24}>
                  <Button onClick={downloadSVGHandler}>Download SVG</Button>
                </Col>
              </Row>
            </Drawer>
          </div>
          {histogramData &&
            props.width &&
            props.height &&
            chartMode === "histogram" && (
              <TemporalHistogram
                width={props.width}
                height={props.height}
                chartData={histogramData}
                isolateData={props.isolateData}
                setSelectedData={props.setSelectedData}
                selectedData={props.selectedData}
                isUserRedraw={isUserRedraw}
                temporalbarSettings={props.temporalbarSettings}
              />
            )}
          {stackedBarData &&
            props.width &&
            props.height &&
            chartMode === "stackedBar" && (
              <TemporalStackedBar
                width={props.width}
                height={props.height}
                chartData={stackedBarData}
                isolateData={props.isolateData}
                setSelectedData={props.setSelectedData}
                selectedData={props.selectedData}
                isUserRedraw={isUserRedraw}
                temporalbarSettings={props.temporalbarSettings}
                colorScale={props.colorScale}
              />
            )}
        </Card>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    isolateData: state.isolateData,
    selectedData: state.selectedData,
    temporalbarSettings: state.temporalbarSettings,
    colorScale: state.colorScale,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deactivateChart: deactivateChart,
      setSelectedData: setSelectedData,
      changeTempResizeSignal: changeTempResizeSignal,
      changeTempChartMode: changeTempChartMode,
      changeTempScaleMode: changeTempScaleMode,
    },
    dispatch
  );
}

const MeasuredTemporalBar = withMeasure(dimensions)(TemporalBar);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeasuredTemporalBar);

/*
<Button
  size={"small"}
  style={{ margin: "0 5px", border: "none" }}
  icon={<RetweetOutlined />}
  onClick={userRedrawHandler}
></Button>
*/
