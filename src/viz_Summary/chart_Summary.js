import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import { getIsolateCompositionByCategory } from "../utils/utils";
import PieChart from "./chart_Pie";
import "./style_summary.css";

const SummaryChart = (props) => {
  //states
  const [data, setData] = useState(null);
  const totalIsolates = props.isolateData.size;
  const observedHeight = props.height - 80;
  const desc_cont_h = observedHeight * 0.2;
  const chart_cont_h = observedHeight * 0.8;

  useEffect(() => {
    if (props.colorScale.colorType) {
      const data = getIsolateCompositionByCategory(
        props.colorScale,
        props.isolateData
      );
      setData(data);
    }
  }, [props.isolateData, props.colorScale]);

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
              colorScale={props.colorScale}
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
            <p>Color index: {props.colorScale.colorType}</p>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SummaryChart;
