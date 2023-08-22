import React from "react";
import { Empty } from "antd";
import { ResponsivePie } from "@nivo/pie";

const PieChart = (props) => {
  const getColor = (d) => d.color;
  const chart_h = props.chart_h ? String(props.chart_h) + "px" : "250px";

  return (
    <div id={"summary-piechart"} style={{ width: "100%", height: chart_h }}>
      {!props.data && <Empty />}
      {props.data && (
        <ResponsivePie
          data={props.data.data}
          margin={{
            top: 25,
            right: props.marginRight,
            bottom: 35,
            left: props.marginLeft,
          }}
          innerRadius={0.5}
          padAngle={1}
          cornerRadius={5}
          sortByValue={true}
          colors={getColor}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextXOffset={6}
          radialLabelsTextColor="#333333"
          radialLabelsLinkOffset={0}
          radialLabelsLinkDiagonalLength={5}
          radialLabelsLinkHorizontalLength={10}
          radialLabelsLinkStrokeWidth={1}
          radialLabelsLinkColor={{ from: "color" }}
          slicesLabelsSkipAngle={10}
          slicesLabelsTextColor="#333333"
          animate={false}
          motionStiffness={90}
          motionDamping={15}
          showLegendsiy={false}
          legends={[]}
        />
      )}
    </div>
  );
};

export default PieChart;
