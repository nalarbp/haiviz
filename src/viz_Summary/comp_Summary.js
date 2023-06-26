/* ============================================================================
============================================================================ */
import React from "react";
import SummaryChart from "./chart_Summary";
import { Row, Col, Card, Button } from "antd";
import { deactivateChart } from "../action/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  DragOutlined,
  CloseOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import withMeasure from "../hocs/withMeasure";
import { downloadSVG } from "../utils/utils";

const dimensions = ["width", "height"];

const SummaryCard = (props) => {
  //Functions
  function onCloseHandler() {
    props.deactivateChart(props.id);
  }
  const downloadSVGHandler = () => {
    downloadSVG("summary-piechart");
  };

  return (
    <React.Fragment>
      <div style={{ height: "100%" }}>
        <Card
          title={"Dataset overview"}
          bordered={true}
          headStyle={{ height: "50px", padding: "0 20px" }}
          style={{ height: "100%" }}
          bodyStyle={{ margin: "0px", padding: "5px" }}
          extra={
            <Row>
              <Col span={8}>
                <Button
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<DownloadOutlined />}
                  onClick={downloadSVGHandler}
                ></Button>
              </Col>
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
                  icon={<CloseOutlined />}
                  onClick={onCloseHandler}
                ></Button>
              </Col>
            </Row>
          }
        >
          {props.width && props.height && (
            <SummaryChart
              width={props.width}
              height={props.height}
              data={props.isolateData}
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
    colorScale: state.colorScale,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      deactivateChart: deactivateChart,
    },
    dispatch
  );
}

const MeasuredSummaryCard = withMeasure(dimensions)(SummaryCard);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeasuredSummaryCard);
