import React from "react";
import { Row, Col } from "antd";
import MapEditorInput from "./comp_MapEditorInput";
import MapEditorWorkspace from "./comp_MapEditorWorkspace";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  loadSvgMapEditor,
  loadLocationsMapEditor,
} from "../action/mapEditor_actions";
import "./style_CreateMap.css";

const CreateMap = (props) => {
  ///const [xmlFile, setXMLFile] = useState(null);
  return (
    <React.Fragment>
      {props.mapEditorSVG === null && (
        <div
          style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
          <Row justify={"center"} style={{ margin: "0px 20px" }}>
            <Col id="map-editor-header" xs={24} md={18} xl={16} xxl={14}>
              <p style={{ fontSize: "30pt", marginBottom: "20px" }}>
                Map Editor
              </p>
              <p style={{ fontSize: "12pt", marginBottom: "5px" }}>
                To create a new map, load a JPEG or PNG file.
                <br /> To update an existing map, load an XML file. <br /> To
                load, click or drag-and-drop the file to input placeholder.{" "}
                <br />
                Accepted file extensions are .jpeg, .jpg, .png, and .xml.
              </p>
            </Col>
          </Row>
          <Row justify={"center"} style={{ width: "80%", margin: "auto" }}>
            <Col
              xs={24}
              sm={16}
              md={12}
              xl={10}
              xxl={6}
              className="input-button"
            >
              <MapEditorInput
                loadSvgMapEditor={props.loadSvgMapEditor}
                loadLocationsMapEditor={props.loadLocationsMapEditor}
              />
            </Col>
          </Row>
        </div>
      )}
      {props.mapEditorSVG !== null && (
        <MapEditorWorkspace
          mapEditorSVG={props.mapEditorSVG}
          loadLocationsMapEditor={props.loadLocationsMapEditor}
        />
      )}
    </React.Fragment>
  );
};
function mapStateToProps(state) {
  return {
    mapEditorSVG: state.mapEditor.svgData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadSvgMapEditor,
      loadLocationsMapEditor,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMap);
