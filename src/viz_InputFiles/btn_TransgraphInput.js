import React, { useEffect, useState } from "react";
import { text } from "d3-fetch";
import { Card, Empty, Spin, Upload } from "antd";
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
    const isolateDataCloned = _.cloneDeep(
      Array.from(props.isolateData.values())
    );
    let graph_promise = await text(fileURL).then(function(result) {
      return result;
    });
    //const graph = parseDOTtoJSON(graph_promise);
    const graph = parseDOTtoCytoscape(graph_promise);
    if (graph) {
      const nodeLabels = graph.nodeLabels;
      const graphData = graph.data;
      const isolateName_list = [];
      const sourceName_list = [];
      isolateDataCloned.forEach(function(d) {
        isolateName_list.push(d.isolate_name);
        sourceName_list.push(d.isolate_sourceName);
      });
      if (graphData) {
        //add layout detection here
        let graph_key = isIsolateOrHost(
          nodeLabels,
          isolateName_list,
          sourceName_list
        );
        let graphWithValidation = { graphKey: graph_key, graphData: graphData };
        props.loadTransgraphData(graphWithValidation);
      }
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
        title={"Transmission graph"}
        style={{ height: "100%" }}
        headStyle={{ textAlign: "left" }}
        bodyStyle={{ margin: "0px", padding: "5px" }}
      >
        {!props.isolateData && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={"Please load the metadata first"}
          />
        )}
        {props.isolateData && !isLoading && !props.transgraphData && (
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
        {props.isolateData && isLoading && !props.transgraphData && <Spin />}
        {props.isolateData && !isLoading && props.transgraphData && (
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
export default TransgraphInput;
