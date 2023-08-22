/* ============================================================================
============================================================================ */
import React from "react";
import { Row, Col } from "antd";
import MapXMLInput from "./btn_MapXMLInput";
import MapEditor from "./comp_MapEditor";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadSVG } from "../action/index";
import { loadSvgData, loadLocationData } from "../action/mapEditor_actions";
import { changeNavLocation } from "../action/navigation_actions";
import "./style_CreateMap.css";
///
const CreateMap = (props) => {
  ///const [xmlFile, setXMLFile] = useState(null);
  return (
    <React.Fragment>
      {props.svgData === null && (
        <div
          style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
          <Row justify={"center"} style={{ margin: "0px 20px" }}>
            <Col id="inputfiles-header" xs={24} md={18} xl={14} xxl={10}>
              <p style={{ fontSize: "32pt", marginBottom: "20px" }}>
                Hi there,
              </p>
              <p style={{ fontSize: "14pt", marginBottom: "5px" }}>
                Welcome to HAIviz local map utility page. Here, you can create
                or update your local map input. To start using it, click the
                input button or drag your SVG or XML file to the input area.
              </p>
            </Col>
          </Row>
          <Row justify={"center"} style={{ width: "80%", margin: "auto" }}>
            <Col
              xs={24}
              sm={12}
              md={11}
              xl={8}
              xxl={4}
              className="input-button"
            >
              <MapXMLInput
                loadSvgData={props.loadSvgData}
                loadLocationData={props.loadLocationData}
                svgData={props.svgData}
                locationData={props.locationData}
              />
            </Col>
          </Row>
        </div>
      )}
      {props.svgData !== null && (
        <MapEditor
          isolateData={props.isolateData}
          svgData={props.svgData}
          locationData={props.locationData}
          loadLocationData={props.loadLocationData}
          loadXML={props.loadXML}
          changeNavLocation={props.changeNavLocation}
        />
      )}
    </React.Fragment>
  );
};
function mapStateToProps(state) {
  return {
    isolateData: state.isolateData,
    svgData: state.mapEditor.svgData,
    locationData: state.mapEditor.locationData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadSvgData: loadSvgData,
      loadLocationData: loadLocationData,
      loadXML: loadSVG,
      changeNavLocation: changeNavLocation,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMap);
