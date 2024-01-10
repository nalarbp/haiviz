import React from "react";
import { Row, Col } from "antd";
import MapEditorChart from "./chart_MapEditor_svg";
import MapEditorTableViewer from "./chart_MapEditor_table";
import "./style_CreateMap.css";
import withMeasure from "../hocs/withMeasure";

const dimensions = ["width", "height"];

const MapEditor = (props) => {
  const MapEditorChartContainer = (props) => {
    return (
      <React.Fragment>
        <MapEditorChart width={props.width} height={props.height} />
      </React.Fragment>
    );
  };
  const MeasuredMapEditorChartContainer = withMeasure(dimensions)(
    MapEditorChartContainer
  );

  return (
    <React.Fragment>
      {props.mapEditorSVG && (
        <div
          style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
          <Row justify={"center"} style={{ padding: "5px" }}>
            <Col id="map-editor-map" xs={24} md={17}>
              <MeasuredMapEditorChartContainer />
            </Col>
            <Col id="map-editor-tables" xs={24} md={6}>
              <MapEditorTableViewer />
            </Col>
          </Row>
        </div>
      )}
    </React.Fragment>
  );
};
export default MapEditor;
/*

*/
