import React, { useEffect, useState } from "react";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { MovementInputSVG } from "../utils/customIcons";
import Moment from "moment";
import { extendMoment } from "moment-range";
import DeleteInput from "./btn_DeleteInput";
import { Card, Row, Col, Spin, Upload } from "antd";
import { parseMovement } from "../utils/utils";

const moment = extendMoment(Moment);
const { Dragger } = Upload;

//props.movementData, loadMovementData

const MovementInput = (props) => {
  const [isLoading, setisLoading] = useState(false);

  //functions
  const beforeUploadHandler = (file) => {
    setisLoading(true);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(evt) {
        const dataUrl = evt.target.result;
        parseMovement(dataUrl, props.loadMovementData, setisLoading);
      };
    }
  };

  useEffect(() => {
    if (props.movementData) {
      setisLoading(false);
    }
  }, [props.movementData]);

  return (
    <React.Fragment>
      <Card
        title={"Gantt"}
        style={{ height: "100%" }}
        headStyle={{ textAlign: "left" }}
        bodyStyle={{ margin: "0px", padding: "5px" }}
      >
        {!isLoading && !props.movementData && (
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
                <MovementInputSVG />
              </h1>
            </Dragger>
          </React.Fragment>
        )}
        {isLoading && !props.movementData && <Spin />}
        {!isLoading && props.movementData && (
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
                <DeleteInput id={"gantt"} />
              </Col>
            </Row>
          </React.Fragment>
        )}
      </Card>
    </React.Fragment>
  );
};
export default MovementInput;
