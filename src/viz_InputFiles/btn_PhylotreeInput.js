import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Upload } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { PhylotreeInputSVG } from "../utils/customIcons";
import { parseTree } from "../utils/utils";
import DeleteInput from "./btn_DeleteInput";

const { Dragger } = Upload;
const PhylotreeInput = (props) => {
  const [isLoading, setisLoading] = useState(false);

  const beforeUploadHandler = (file) => {
    setisLoading(true);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(evt) {
        const dataUrl = evt.target.result;
        parseTree(dataUrl, props.loadTreeData, setisLoading);
      };
    }
  };

  useEffect(() => {
    if (props.treeData) {
      setisLoading(false);
    }
  }, [props.treeData]);

  return (
    <React.Fragment>
      <Card
        title={"Tree"}
        style={{ height: "100%" }}
        headStyle={{ textAlign: "left" }}
        bodyStyle={{ margin: "0px", padding: "5px" }}
      >
        {!isLoading && !props.treeData && (
          <React.Fragment>
            <Dragger
              accept={".nwk, .tre, .tree, .txt"}
              style={{ padding: "10px" }}
              name="file"
              multiple={false}
              action="dummy-post"
              beforeUpload={beforeUploadHandler}
            >
              <h1>
                <PhylotreeInputSVG />
              </h1>
            </Dragger>
          </React.Fragment>
        )}
        {isLoading && !props.treeData && <Spin />}
        {!isLoading && props.treeData && (
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
              <DeleteInput id={'tree'}/>
            </Col>
          </Row>
      </React.Fragment>
      )}
    </Card>
  </React.Fragment>
  );
};
export default PhylotreeInput;
