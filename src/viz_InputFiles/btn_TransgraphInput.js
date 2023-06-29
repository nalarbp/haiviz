import React, { useEffect, useState } from "react";
import { text } from "d3-fetch";
import DeleteInput from "./btn_DeleteInput";
import { Card, Row, Col, Spin, Upload } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { parseDOTtoCytoscape, isIsolateOrHost } from "../utils/utils";
import { TransgraphInputSVG } from "../utils/customIcons";

const { Dragger } = Upload;
const _ = require("lodash");

//props.transgraphData, props.loadTransgraphData

const TransgraphInput = (props) => {
  const [isLoading, setisLoading] = useState(false);

  //functions
  async function parseGraph(fileURL) {
    let graph_promise = await text(fileURL).then(function(result) {
      return result;
    });
    //const graph = parseDOTtoJSON(graph_promise);
    const graph = parseDOTtoCytoscape(graph_promise);
    if (graph) {
      props.loadTransgraphData(graph);
    } else {
      setisLoading(false);
      return;
    }
  }

  const beforeUploadHandler = (file) => {
    setisLoading(true);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(evt) {
        const dataUrl = evt.target.result;
        parseGraph(dataUrl);
      };
    }
  };

  useEffect(() => {
    if (props.transgraphData) {
      setisLoading(false);
    }
  }, [props.transgraphData]);

  return (
    <React.Fragment>
      <Card
        title={"Graph"}
        style={{ height: "100%" }}
        headStyle={{ textAlign: "left" }}
        bodyStyle={{ margin: "0px", padding: "5px" }}
      >
        {!isLoading && !props.transgraphData && (
          <React.Fragment>
            <Dragger
              accept={".gv, .dot"}
              style={{ padding: "10px" }}
              name="file"
              multiple={false}
              action="dummy-post"
              beforeUpload={beforeUploadHandler}
            >
              <h1>
                <TransgraphInputSVG />
              </h1>
            </Dragger>
          </React.Fragment>
        )}
        {isLoading && !props.transgraphData && <Spin />}
        {!isLoading && props.transgraphData && (
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
                <DeleteInput id={'network'}/>
              </Col>
            </Row>
        </React.Fragment>
        )}
      </Card>
    </React.Fragment>
  );
};
export default TransgraphInput;
