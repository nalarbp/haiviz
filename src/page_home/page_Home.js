/* ============================================================================
This is a container for landing page
- Shows video
============================================================================ */
import React, { useState } from "react";
import { Row, Col, Layout, Button, Modal } from "antd";
import ReactPlayer from "react-player/youtube";
//import introVideo from "../img/home.mp4";
import Showcases from "./comp_showcases";
import "./style_Home.css";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from "redux";
import { changeNavLocation } from "../action/navigation_actions";

const { Footer, Content } = Layout;

const Home = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const closeModalHandler = () => {
    setModalVisible(false);
  };
  return (
    <React.Fragment>
      <Layout style={{ marginTop: "20px" }}>
        <Content>
          <Row id="content-header-row" justify="center">
            <Col>
              <Modal
                visible={modalVisible}
                closable={true}
                onOk={closeModalHandler}
                onCancel={closeModalHandler}
                centered={true}
                width={640}
                footer={null}
              >
                <ReactPlayer
                  url={"https://youtu.be/JUUNn8KAcU0"}
                  controls={true}
                  width={"100%"}
                  playing={modalVisible}
                />
              </Modal>
            </Col>

            <Col xs={24} md={16} lg={16} xl={12} xxl={8} id="content-header">
              <p
                style={{
                  fontSize: "45pt",
                  fontWeight: "bold",
                  lineHeight: "40pt",
                  margin: "0px auto",
                }}
              >
                HAIviz v.0.3
              </p>
              <br />
              <p
                style={{
                  fontSize: "26pt",
                  lineHeight: "28pt",
                  fontWeight: "lighter",
                }}
              >
                Healthcare-associated infections visualization tool
              </p>
              <p style={{ fontSize: "13pt", lineHeight: "18pt" }}>
                Hi, welcome to HAIviz, a single page application build to help
                you integrate and interactively visualize genomic
                epidemiological information of a local outbreak.
              </p>
              <br />
              <Button
                style={{
                  backgroundColor: "#9ff52f",
                  border: "1px solid white",
                  margin: "0 10px 10px 0",
                  textAlign: "center",
                }}
                shape={"round"}
                size={"large"}
                onClick={() => {
                  setModalVisible(true);
                }}
              >
                How it works
              </Button>

              <NavLink to="/documentation">
                <Button
                  style={{
                    backgroundColor: "#42ede7",
                    border: "1px solid white",
                    margin: "0 10px 10px 0",
                    textAlign: "center",
                    padding: "0 2em",
                  }}
                  shape={"round"}
                  size={"large"}
                  onClick={() => {
                    props.changeNavLocation("documentation");
                  }}
                >
                  Let's get started
                </Button>
              </NavLink>
            </Col>
          </Row>
          <Showcases changeNavLocation={props.changeNavLocation} />
        </Content>

        <Footer style={{ position: "sticky", margin: "50px 0 0 0" }}>
          <div style={{ textAlign: "center" }}>
            <p>
              <a
                href="https://haiviz.beatsonlab.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                HAIviz v.0.3
              </a>{" "}
              | built.2021-09-23
              <br /> HAIviz v.0.2 is available{" "}
              <a
                href="https://v02.haiviz.beatsonlab.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              <br /> Developed by Budi Permana at{" "}
              <a
                href="https://beatsonlab.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Beatson Lab
              </a>
              <br />{" "}
              <a
                href="https://www.uq.edu.au/"
                target="_blank"
                rel="noopener noreferrer"
              >
                The University of Queensland
              </a>{" "}
              | Australia
            </p>
          </div>
        </Footer>
      </Layout>
    </React.Fragment>
  );
};
function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators({ changeNavLocation: changeNavLocation }, dispatch);
}

export default connect(null, mapDispatchToProps)(Home);

/*
<Link to="/haiviz-spa">
                <Button
                  style={{
                    backgroundColor: "#9ff52f",
                    border: "1px solid white",
                    margin: "0 10px 10px 0",
                    textAlign: "center",
                  }}
                  shape={"round"}
                  size={"large"}
                  onClick={() => {
                    props.changeNavLocation("haivizApp");
                  }}
                >
                  Let's get started
                </Button>
              </Link>
              */
