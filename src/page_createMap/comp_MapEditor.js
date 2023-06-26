/* ============================================================================
============================================================================ */
import React from "react";
import { Row } from "antd";
import MapEditorChart from "./chart_MapEditor_svg";
import "./style_CreateMap.css";

//props.xmlFile
const MapEditor = (props) => {
  return (
    <React.Fragment>
      {props.svgData && (
        <div
          style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
          <Row justify={"center"} style={{ padding: "20px" }}>
            <MapEditorChart
              svgMap={props.svgData}
              loadLocationData={props.loadLocationData}
              locationData={props.locationData}
              isolateData={props.isolateData}
              loadXML={props.loadXML}
              changeNavLocation={props.changeNavLocation}
            />
          </Row>
        </div>
      )}
    </React.Fragment>
  );
};
export default MapEditor;
