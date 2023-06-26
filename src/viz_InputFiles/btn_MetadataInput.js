import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Upload } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { MetadataInputSVG } from "../utils/customIcons";
import { getIsolateData } from "../utils/utils";
import DeleteInput from "./btn_DeleteInput";

const { Dragger } = Upload;
const MetadataInput = (props) => {
  const [isLoading, setisLoading] = useState(false);

  const beforeUploadHandler = (file) => {
    setisLoading(true);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(evt) {
        const dataUrl = evt.target.result;
        getIsolateData(
          dataUrl,
          props.loadIsolateData,
          props.setColorScale,
          props.loadSimulatedMap,
          setisLoading
        );
      };
    }
  };

  useEffect(() => {
    if (props.isolateData) {
      setisLoading(false);
    }
  }, [props.isolateData]);

  return (
    <React.Fragment>
      <Card
        title={"Metadata"}
        style={{ height: "100%" }}
        headStyle={{ textAlign: "left" }}
        bodyStyle={{ margin: "0px", padding: "5px" }}
      >
        {!isLoading && !props.isolateData && (
          <React.Fragment>
            <Dragger
              accept={".csv"}
              style={{ padding: "10px" }}
              name="file"
              multiple={false}
              action="dummy-post"
              beforeUpload={beforeUploadHandler}
            >
              <h1>
                <MetadataInputSVG />
              </h1>
            </Dragger>
          </React.Fragment>
        )}
        {isLoading && !props.isolateData && <Spin />}
        {!isLoading && props.isolateData && (
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
              <DeleteInput id={'metadata'}/>
              </Col>
              </Row>
              
            
          </React.Fragment>
        )}
      </Card>
    </React.Fragment>
  );
};
export default MetadataInput;
