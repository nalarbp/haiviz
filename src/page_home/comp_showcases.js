import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "antd";
import * as constant from "../utils/constants";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  preloadedDataToStore,
  selectedPreloadedDataToStore,
  loadIsolateData,
  loadSVG,
  loadTransmissionData,
  loadMovementData,
  setColorScale,
  resetStore,
} from "../action/index";
import { loadSimulatedMap } from "../action/simulatedMap_actions";
import { loadTreeData } from "../action/phyloTree_actions";

import { readPreloadedDatasetJSON, getRandomInt } from "../utils/utils";
import { EyeOutlined } from "@ant-design/icons";

const { Meta } = Card;

const Showcases = (props) => {
  //make initial state: dataset options
  const [dataCard, setDataCard] = useState([]);
  let setisLoading = () => {}; //dummy function, to match drag and drop button functions

  if (props.preloadedData === null) {
    readPreloadedDatasetJSON(
      constant.PRELOADED_DATA,
      props.preloadedDataToStore
    );
  }

  useEffect(() => {
    if (props.preloadedData) {
      let data_options = [];
      props.preloadedData.forEach((v, k) => {
        let card_name = v["name"];
        let card_desc = v["description"];
        if (card_desc.length > 50) {
          card_desc = card_desc.substring(0, 50) + " ...";
        }
        let card_bg_pattern_class = "hp-" + String(getRandomInt(2, 10));
        let card_bg_col_class = "hp-col-" + String(getRandomInt(1, 10));
        data_options.push(
          <Col xs={24} md={12} lg={6} xxl={5} key={k}>
            <Card
              hoverable={true}
              className={
                card_bg_col_class +
                " " +
                card_bg_pattern_class +
                " showcase-card"
              }
              style={{ width: "100%", padding: "0px" }}
              actions={[
                <Link to={"/" + String(k)}>
                  <Button value={k} key={k} icon={<EyeOutlined />}>
                    View data
                  </Button>
                </Link>,
              ]}
            >
              <Meta
                className={"showcase-meta-desc"}
                title={card_name}
                description={card_desc}
              />
            </Card>
          </Col>
        );
      });
      setDataCard(data_options);
    }
  }, [props.preloadedData]);

  return (
    <div style={{ width: "100%", backgroundColor: "white" }}>
      <Row
        id="content-showcase-row"
        justify="center"
        gutter={[24, 24]}
        style={{ width: "80%", margin: "auto", padding: "40px 0" }}
      >
        <Col xs={24} style={{ marginBottom: "-20px" }}>
          <p style={{ textAlign: "center", fontSize: "18pt" }}>
            Preloaded datasets <br />
            <span style={{ fontSize: "10pt", fontWeight: "bold" }}>
              {" "}
              Use the following preloaded dataset for a quick demo{" "}
            </span>
          </p>
        </Col>
        {//when data_options is not empty, display the showcase
        dataCard.length > 0 ? (
          dataCard
        ) : (
          <Col xs={24}>
            <p style={{ textAlign: "center", fontSize: "18pt" }}>
              Loading preloaded dataset...
            </p>
          </Col>
        )}
      </Row>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    isolateData: state.isolateData,
    preloadedData: state.preloadedData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadIsolateData,
      loadXML: loadSVG,
      loadTreeData,
      loadTransgraphData: loadTransmissionData,
      loadMovementData,
      setColorScale,
      loadSimulatedMap,
      selectedPreloadedDataToStore,
      preloadedDataToStore,
      resetStore,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Showcases);
