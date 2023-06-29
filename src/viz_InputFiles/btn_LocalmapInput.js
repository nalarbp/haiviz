import React, { useEffect, useState } from "react";
import { xml } from "d3-fetch";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { LocalmapInputSVG } from "../utils/customIcons";
import DeleteInput from "./btn_DeleteInput";
import { Card, Row, Col, Spin, Upload } from "antd";

const { Dragger } = Upload;
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
        title={"Local Map"}
        headStyle={{ textAlign: "left" }}
        bodyStyle={{ margin: "0px", padding: "5px" }}
      >
        {!isLoading && !props.svgMap && (
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
        {isLoading && !props.svgMap && <Spin />}
        {!isLoading && props.svgMap && (
          <React.Fragment>
            <Row justify="center" className="input_card"> 
              <Col>
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "20pt" }}
              />
                <p>Loaded!</p>
              </Col>
            </Row>
            <Row justify="center">
              <Col>
                <DeleteInput id={'map'}/>
              </Col>
            </Row>
        </React.Fragment>
        )}
      </Card>
    </React.Fragment>
  );
};
export default LocalmapInput;
