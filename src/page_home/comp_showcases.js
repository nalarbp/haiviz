/* ============================================================================
============================================================================ */
import React from "react";
import { Card, Row, Col, Button } from "antd";
import showcaseImg_1 from "../img/showcase-img-1.png";
import showcaseImg_2 from "../img/showcase-img-2.png";
import showcaseImg_3 from "../img/showcase-img-3.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadSimulatedMap } from "../action/simulatedMap_actions";
import { loadTreeData } from "../action/phyloTree_actions";
import {
  loadIsolateData,
  loadSVG,
  loadTransmissionData,
  loadMovementData,
  setColorScale,
  deactivateChartMulti,
} from "../action/index";
import { loadShowcaseData } from "../utils/loadShowcaseData";

import "./style_Home.css";

import { EyeOutlined } from "@ant-design/icons";
const { Meta } = Card;

const Showcases = (props) => {
  const showcaseViewHandler = (e) => {
    props.changeNavLocation("haivizApp");
    loadShowcaseData(
      e.target.value,
      props.loadIsolateData,
      props.setColorScale,
      props.loadSimulatedMap,
      props.loadXML,
      props.loadTreeData,
      props.loadMovementData,
      props.loadTransgraphData,
      props.deactivateChartMulti
    );
  };

  return (
    <div style={{ width: "100%", backgroundColor: "white" }}>
      <Row
        id="content-showcase-row"
        justify="center"
        gutter={[24, 24]}
        style={{ width: "80%", margin: "auto", padding: "40px 0" }}
      >
        <Col xs={24}>
          <p style={{ textAlign: "center", fontSize: "18pt" }}>Showcase</p>
        </Col>
        <Col xs={24} md={12} lg={8} xxl={5} id="showcase-1">
          <Card
            hoverable={true}
            style={{ width: "100%", padding: "0px" }}
            cover={<img alt="example" src={showcaseImg_1} />}
            actions={[
              <Link to="/haiviz-spa">
                <Button
                  value="showcase-data-1"
                  key="view-1"
                  id={"showcase-buttons"}
                  onClick={showcaseViewHandler}
                  icon={<EyeOutlined />}
                >
                  View
                </Button>
              </Link>,
            ]}
          >
            <Meta
              className={"showcase-meta-desc"}
              title="Sample dataset"
              description="A meaningless sample dataset contains 100 hypothetical isolates, a building floorplan, phylogenetic tree, and transmission graph for you to play around"
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8} xxl={5} id="showcase-2">
          <Card
            hoverable={true}
            style={{ width: "100%" }}
            cover={<img alt="example" src={showcaseImg_2} />}
            actions={[
              <Link to="/haiviz-spa">
                <Button
                  value="showcase-data-2"
                  key="view-2"
                  id={"showcase-buttons"}
                  onClick={showcaseViewHandler}
                  icon={<EyeOutlined />}
                >
                  View
                </Button>
              </Link>,
            ]}
          >
            <Meta
              className={"showcase-meta-desc"}
              title="Carbapenem-resistant Klebsiella pneumonia outbreak in the U.S"
              description={`Dataset from Snitkin et al., 2012 reporting use of
              genomic and epidemiological data to track nosocomial K. pneumonia outbreak `}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8} xxl={5} id="showcase-3">
          <Card
            hoverable={true}
            style={{ width: "100%" }}
            cover={<img alt="example" src={showcaseImg_3} />}
            actions={[
              <Link to="/haiviz-spa">
                <Button
                  value="showcase-data-3"
                  key="view-3"
                  id={"showcase-buttons"}
                  onClick={showcaseViewHandler}
                  icon={<EyeOutlined />}
                >
                  View
                </Button>
              </Link>,
            ]}
          >
            <Meta
              className={"showcase-meta-desc"}
              title={"Nosocomial Klebsiella pneumonia outbreak in Nepal"}
              description={
                "Dataset from Chung et al., 2015 reporting two K. pneumonia strains causing two different outbreaks at a major hospital in Kathmandu, Nepal"
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    isolateData: state.isolateData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadIsolateData: loadIsolateData,
      loadXML: loadSVG,
      loadTreeData: loadTreeData,
      loadTransgraphData: loadTransmissionData,
      loadMovementData: loadMovementData,
      setColorScale: setColorScale,
      loadSimulatedMap: loadSimulatedMap,
      deactivateChartMulti: deactivateChartMulti,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Showcases);
