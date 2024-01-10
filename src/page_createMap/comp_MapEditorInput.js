import React, { useEffect, useState } from "react";
import { xml } from "d3-fetch";
import { Card, Spin, Upload } from "antd";
import { SVGIcon } from "../utils/customIcons";
import { v1 as uuidv1 } from "uuid";

const xmlJSconvert = require("xml-js");
const { Dragger } = Upload;

const MapEditorInput = (props) => {
  const [isLoading, setisLoading] = useState(false);

  //functions
  function parseRasterImage(fileURL) {
    const img = new Image();
    img.src = fileURL;
    img.onload = function() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("id", "haiviz-localmap-svg");
      svg.setAttribute("width", img.width);
      svg.setAttribute("height", img.height);
      svg.setAttribute("viewBox", `0 0 ${img.width} ${img.height}`);
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

      const image = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "image"
      );
      image.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        fileURL
      );
      image.setAttribute("width", img.width);
      image.setAttribute("height", img.height);
      image.setAttribute("x", 0);
      image.setAttribute("y", 0);
      svg.appendChild(image);

      props.loadSvgMapEditor(svg);
      setisLoading(false);
    };
  }

  async function parseXMl(fileURL) {
    const xml_promise = await xml(fileURL);
    const xmlNodeClone = xml_promise.cloneNode(true);
    const svgNodeClone = xmlNodeClone.getElementsByTagName("svg")[0]
      ? xmlNodeClone.getElementsByTagName("svg")[0].cloneNode(true)
      : null;

    if (!svgNodeClone) {
      alert("Error: No SVG content in input file.");
      setisLoading(false);
      return;
    }

    //get mapdata, serialize it, convert to object
    const mapDataNode =
      xmlNodeClone &&
      xmlNodeClone.getElementsByTagName("mapdata") &&
      xmlNodeClone.getElementsByTagName("mapdata")[0]
        ? xmlNodeClone.getElementsByTagName("mapdata")[0].cloneNode(true)
        : null;

    let locationData = [];
    if (mapDataNode) {
      const serializedMapData = new XMLSerializer().serializeToString(
        mapDataNode
      );
      const locationDataObj = xmlJSconvert.xml2js(serializedMapData, {
        compact: true,
        spaces: 0,
      });

      if (Array.isArray(locationDataObj.mapdata.location)) {
        locationDataObj.mapdata.location.forEach((d) => {
          locationData.push({
            id: uuidv1(),
            x: +d._attributes.x,
            y: +d._attributes.y,
            active: false,
            name: d._attributes.name,
          });
        });
      } else {
        locationData.push({
          id: uuidv1(),
          x: +locationDataObj.mapdata.location._attributes.x,
          y: +locationDataObj.mapdata.location._attributes.y,
          active: false,
          name: locationDataObj.mapdata.location._attributes.name,
        });
      }
    }

    props.loadSvgMapEditor(svgNodeClone);
    props.loadLocationsMapEditor(locationData);
  }

  const beforeUploadHandler = (file, fileList) => {
    setisLoading(true);
    if (file) {
      const extension = file.name.split(".").pop();
      let acceptedExtensions = [
        "jpg",
        "jpeg",
        "png",
        "xml",
        ".JPEG",
        ".JPG",
        ".PNG",
        ".XML",
      ];

      if (!acceptedExtensions.includes(extension)) {
        alert(
          "Error: Invalid file type. Please upload a JPEG, PNG or XML file."
        );
        setisLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(evt) {
        const dataUrl = evt.target.result;
        const extensionLower = extension.toLowerCase();
        if (extensionLower === "xml") {
          parseXMl(dataUrl);
        }

        if (
          extensionLower === "jpg" ||
          extensionLower === "jpeg" ||
          extensionLower === "png"
        ) {
          parseRasterImage(dataUrl);
        } else {
          alert(
            "Error: Invalid file type. Please upload a JPEG, PNG or XML file."
          );
          setisLoading(false);
          return;
        }
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
        title={"Load a JPEG/PNG/XML file here"}
        headStyle={{ textAlign: "center" }}
        bodyStyle={{ margin: "0px", padding: "5px" }}
      >
        {!isLoading && !props.mapEditorSVG && (
          <React.Fragment>
            <Dragger
              style={{ width: "100%", padding: "10px" }}
              name="file"
              accept=".jpg, .png, .jpeg, .xml"
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
