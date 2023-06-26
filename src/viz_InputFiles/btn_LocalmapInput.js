import React, { useEffect, useState } from "react";
import { xml } from "d3-fetch";
import { Card, Empty, Spin, Upload } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { LocalmapInputSVG } from "../utils/customIcons";

const { Dragger } = Upload;

//props.svgMap, props.loadSVG

const LocalmapInput = (props) => {
  const [isLoading, setisLoading] = useState(false);

  //functions
  async function parseXML(fileURL) {
    var xml_promise = await xml(fileURL);
    props.loadXML(xml_promise);
  }

  const beforeUploadHandler = (file) => {
    setisLoading(true);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(evt) {
        const dataUrl = evt.target.result;
        parseXML(dataUrl);
      };
    }
  };

  useEffect(() => {
    if (props.svgMap) {
      setisLoading(false);
    }
  }, [props.svgMap]);

  return (
    <React.Fragment>
      <Card
        title={"Local map"}
        headStyle={{ textAlign: "left" }}
        bodyStyle={{ margin: "0px", padding: "5px" }}
      >
        {!props.isolateData && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={"Please load the metadata first"}
          />
        )}
        {props.isolateData && !isLoading && !props.svgMap && (
          <React.Fragment>
            <Dragger
              accept={".xml"}
              style={{ padding: "10px" }}
              name="file"
              multiple={false}
              action="dummy-post"
              beforeUpload={beforeUploadHandler}
            >
              <h1>
                <LocalmapInputSVG />
              </h1>
            </Dragger>
          </React.Fragment>
        )}
        {props.isolateData && isLoading && !props.svgMap && <Spin />}
        {props.isolateData && !isLoading && props.svgMap && (
          <React.Fragment>
            <div style={{ padding: "10px" }}>
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "20pt" }}
              />
              <p>Loaded!</p>
            </div>
          </React.Fragment>
        )}
      </Card>
    </React.Fragment>
  );
};
export default LocalmapInput;
