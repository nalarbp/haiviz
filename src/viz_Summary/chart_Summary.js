/* ============================================================================
============================================================================ */
import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import {
  getIsolateCompositionByCategory,
  getColorScale,
  getColorTypeTitle,
} from "../utils/utils";
import PieChart from "./chart_Pie";
import "./style_summary.css";

const SummaryChart = (props) => {
  //states
  const [data, setData] = useState(null);
  const totalIsolates = props.data.size;
  const observedHeight = props.height - 80;
  const desc_cont_h = observedHeight * 0.2;
  const chart_cont_h = observedHeight * 0.8;
  const currentColorScale = getColorScale(props.colorScale);

  useEffect(() => {
    if (props.colorScale.colorType) {
      const data = getIsolateCompositionByCategory(
        props.colorScale.colorType,
        props.data
      );
      setData(data);
    }
  }, [props.data, props.colorScale]);

  return (
    <React.Fragment>
      <Row>
        <Col style={{ backgroundColor: "none" }} xs={24}>
          <div style={{ height: chart_cont_h, backgroundColor: "none" }}>
            <PieChart
              chart_h={chart_cont_h}
              data={data}
              marginLeft={20}
              marginRight={20}
              legendsXOffset={0}
              colorScale={currentColorScale}
            />
          </div>
          <div
            style={{
              backgroundColor: "none",
              fontSize: "16px",
              marginTop: "5px",
              padding: "5px",
              textAlign: "center",
              lineHeight: "7px",
              height: desc_cont_h,
            }}
          >
            <p>Total isolates: {totalIsolates}</p>
            <p>Color index: {getColorTypeTitle(props.colorScale.colorType)}</p>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SummaryChart;

/*
<Col
  style={{
    padding: "10px",
    backgroundColor: "orange"
  }}
  xs={24}
  md={8}
>
  <Text
    ellipsis={true}
    style={{
      fontWeight: "bold",
      color: "#1eb776"
    }}
  >
    {totalIsolates} isolates
  </Text>
  <p id="color-index-text">Color index:</p>
  <span style={{ lineHeight: "12px" }} />
  <p id="color-index-desc">
    {getColorTypeTitle(props.colorScale.colorType)}
  </p>
</Col>
 */
