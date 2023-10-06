/* ============================================================================

============================================================================ */
import React, { useEffect, useState } from "react";
import LocalmapChart from "./chart_Localmap_svg";
import LocalmapSettings from "./comp_LocalMap_Settings.js";
import { Row, Col, Card, Button, Skeleton } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import withMeasure from "../hocs/withMeasure";
import {
  DragOutlined,
  CloseOutlined,
  RetweetOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { deactivateChart, setSelectedData } from "../action/index";
import {
  changeLocalmapResizeSignal,
  changeLocalmapNodeSize,
  changeLocalmapTextSize,
  changeLocalmapTextOffset,
  changeLocalmapLayout,
  changeLocalmapIsLocTextShown,
} from "../action/localMap_actions";

const dimensions = ["width", "height"];
const xmlJSconvert = require("xml-js");

const Localmap = (props) => {
  const [isUserRedraw, setisUserRedraw] = useState(false);
  const [isDrawerVisible, setisDrawerVisible] = useState(false);
  const [localmapData, setlocalmapData] = useState(null);

  // USEEFFECTS
  useEffect(() => {
    if (isUserRedraw) {
      setisUserRedraw(false);
    }
  }, [isUserRedraw]);

  useEffect(() => {
    if (props.xmlMap && !localmapData) {
      // get svg node here
      const xmlNodeClone = props.xmlMap.cloneNode(true);
      const svgNodeClone = xmlNodeClone
        .getElementsByTagName("svg")[0]
        .cloneNode(true);
      // get mapdata, serialize it, convert to object
      const mapDataNode = xmlNodeClone
        .getElementsByTagName("mapdata")[0]
        .cloneNode(true);
      const serializedMapData = new XMLSerializer().serializeToString(
        mapDataNode
      );
      const locationDataObj = xmlJSconvert.xml2js(serializedMapData, {
        compact: true,
        spaces: 0,
      });

      const locationData = Array.isArray(locationDataObj.mapdata.location)
        ? locationDataObj.mapdata.location.map((d) => {
            return {
              name: d._attributes.name,
              x: +d._attributes.x,
              y: +d._attributes.y,
            };
          })
        : locationDataObj &&
          typeof locationDataObj.mapdata.location === "object"
        ? [
            {
              name: locationDataObj.mapdata.location._attributes.name,
              x: +locationDataObj.mapdata.location._attributes.x,
              y: +locationDataObj.mapdata.location._attributes.y,
            },
          ]
        : null;

      const locationData_Map = new Map();

      if (locationData_Map) {
        locationData.forEach((d) => {
          locationData_Map.set(d.name, d);
        });
      }

      let localmapData = {
        xmlSVG: svgNodeClone,
        locationTable: locationData_Map,
      };

      if ((svgNodeClone, locationData_Map)) {
        setlocalmapData(localmapData);
      } else {
        alert(
          "Unable to read the map, refresh the page and re-load a valid HAIviz XML map"
        );
      }
    }
  }, [props.xmlMap, props.isolateData, localmapData]);

  //HANDLERS
  const closeCardHandler = () => {
    props.deactivateChart(props.id);
    props.changeLocalmapResizeSignal(false);
  };
  const openDrawerHandler = () => {
    setisDrawerVisible(true);
  };
  const closeDrawerHandler = () => {
    setisDrawerVisible(false);
  };
  const userRedrawHandler = (val) => {
    if (!isUserRedraw) {
      setisUserRedraw(true);
      props.changeLocalmapResizeSignal(false);
    }
  };

  return (
    <React.Fragment>
      <div style={{ height: "100%" }}>
        <Card
          title={"Map"}
          bordered={true}
          headStyle={{ height: "50px", padding: "0 20px" }}
          style={{ height: "100%" }}
          bodyStyle={{ margin: "0px", padding: "5px" }}
          extra={
            <Row>
              <Col span={6}>
                <Button
                  className="panelHeader"
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<DragOutlined />}
                ></Button>
              </Col>
              <Col span={6}>
                <Button
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<RetweetOutlined />}
                  onClick={userRedrawHandler}
                ></Button>
              </Col>
              <Col span={6}>
                <Button
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<SettingOutlined />}
                  onClick={openDrawerHandler}
                ></Button>
              </Col>
              <Col span={6}>
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
          <div id="localmap-drawer-settings">
            <LocalmapSettings
              isDrawerVisible={isDrawerVisible}
              closeDrawerHandler={closeDrawerHandler}
              localmapSettings={props.localmapSettings}
              changeLocalmapTextSize={props.changeLocalmapTextSize}
              changeLocalmapTextOffset={props.changeLocalmapTextOffset}
              changeLocalmapNodeSize={props.changeLocalmapNodeSize}
              changeLocalmapLayout={props.changeLocalmapLayout}
              changeLocalmapIsLocTextShown={props.changeLocalmapIsLocTextShown}
            />
          </div>
          {!localmapData && (
            <Row style={{ padding: "20px" }}>
              <Skeleton active={true} />
            </Row>
          )}
          {localmapData && (
            <Row>
              <LocalmapChart
                width={props.width}
                height={props.height}
                data={localmapData}
                isolateData={props.isolateData}
                localmapSettings={props.localmapSettings}
                isUserRedraw={isUserRedraw}
                selectedData={props.selectedData}
                setSelectedData={props.setSelectedData}
                colorScale={props.colorScale}
              />
            </Row>
          )}
        </Card>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    isolateData: state.isolateData,
    xmlMap: state.floorplan,
    selectedData: state.selectedData,
    localmapSettings: state.localmapSettings,
    colorScale: state.colorScale,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      deactivateChart,
      changeLocalmapResizeSignal,
      changeLocalmapNodeSize,
      changeLocalmapTextSize,
      changeLocalmapTextOffset,
      changeLocalmapLayout,
      changeLocalmapIsLocTextShown,
      setSelectedData,
    },
    dispatch
  );
}

const MeasuredLocalmap = withMeasure(dimensions)(Localmap);

export default connect(mapStateToProps, mapDispatchToProps)(MeasuredLocalmap);

///////////////////////////////////////////////////////////////////////////////
/*
<Button
  size={"small"}
  style={{ margin: "0 5px", border: "none" }}
  icon={<DownloadOutlined />}
></Button>
*/
