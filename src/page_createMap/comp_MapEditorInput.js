import React, { useEffect, useState } from "react";
import { xml } from "d3-fetch";
import { Card, Spin, Upload } from "antd";
import { SVGIcon } from "../utils/customIcons";
import { getMapLocationData } from "../utils/utils";
import { v1 as uuidv1 } from "uuid";

const { Dragger } = Upload;

const MapEditorInput = (props) => {
  const [isLoading, setisLoading] = useState(false);

  //functions
  async function parseXMl(fileURL) {
    const xml_promise = await xml(fileURL);
    const xmlNodeClone = xml_promise.cloneNode(true);
    const svgNodeClone = xmlNodeClone.getElementsByTagName("svg")[0]
      ? xmlNodeClone.getElementsByTagName("svg")[0].cloneNode(true)
      : null;

    if (svgNodeClone) {
      svgNodeClone.setAttribute("id", "haiviz-localmap-svg");
      let svg_w_att = svgNodeClone.getAttribute("width");
      let svg_h_att = svgNodeClone.getAttribute("height");
      //check if string px is detected in svg_w_att and svg_h_att
      let svgNodes_w = svg_w_att.includes("px")
        ? +svgNodeClone.getAttribute("width").split("px")[0]
        : null;
      let svgNodes_h = svg_h_att.includes("px")
        ? +svgNodeClone.getAttribute("height").split("px")[0]
        : null;
      //if w and h not pixel, check if it is percentage
      if (!svgNodes_w || !svgNodes_h) {
        let viewBox = svgNodeClone.getAttribute("viewBox").split(" ");
        svgNodes_w =
          svg_w_att.includes("%") && +viewBox[2] ? +viewBox[2] : null;
        svgNodes_h =
          svg_h_att.includes("%") && +viewBox[3] ? +viewBox[3] : null;
      }
      if (!svgNodes_w || !svgNodes_h) {
        alert(
          "Invalid input. Requirement of width/height or viewbox atrributes for the SVG input file was not met. Please use the SVG example/template file in page Doccumentation. "
        );
        setisLoading(false);
        return;
      }
      // // get mapdata, serialize it, convert to object
      const mapDataNode = xmlNodeClone.getElementsByTagName("mapdata")[0]
        ? xmlNodeClone.getElementsByTagName("mapdata")[0].cloneNode(true)
        : null;
      const locationData = mapDataNode
        ? Array.from(getMapLocationData(mapDataNode).entries()).map((d) => {
            return {
              id: uuidv1(),
              x: d[1].x,
              y: d[1].y,
              active: false,
              name: d[1].name,
            };
          })
        : null;
      props.loadSvgMapEditor(svgNodeClone);
      props.loadLocationsMapEditor(locationData);
    } else {
      alert(
        "Invalid input. Please ensure the SVG image has correct width/height and viewbox. See Doccumentation for more SVG image requirement details."
      );
      setisLoading(false);
    }

    //props.setXMLFile(xml_promise);
  }

  const beforeUploadHandler = (file, fileList) => {
    setisLoading(true);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(evt) {
        const dataUrl = evt.target.result;
        parseXMl(dataUrl);
      };
    }
  };

  useEffect(() => {
    if (props.mapEditorLocations && props.mapEditorSVG) {
      setisLoading(false);
    }
  }, [props.mapEditorLocations, props.mapEditorSVG]);
  return (
    <React.Fragment>
      <Card
        title={"Load SVG or XML file here"}
        headStyle={{ textAlign: "center" }}
        bodyStyle={{ margin: "0px", padding: "5px" }}
      >
        {!isLoading && !props.mapEditorSVG && (
          <React.Fragment>
            <Dragger
              style={{ width: "100%", padding: "10px" }}
              name="file"
              accept=".svg, .xml"
              multiple={false}
              action="dummy-post"
              beforeUpload={beforeUploadHandler}
            >
              <h1>
                <SVGIcon />
              </h1>
            </Dragger>
          </React.Fragment>
        )}
        {isLoading && !props.mapEditorSVG && !props.mapEditorLocations && (
          <Spin />
        )}
      </Card>
    </React.Fragment>
  );
};
export default MapEditorInput;
