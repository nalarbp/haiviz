import React from "react";
import { Row, Col } from "antd";
import NavMenu from "./NavMenu";
import logo_2 from "../img/logo_2.png";
import "./style_navigation.css";

const MainHeader = props => {
  return (
    <React.Fragment>
      <Row id="main-header">
        <Col xs={16} sm={12}>
          <img src={logo_2} alt="HAIviz" height="75px" width="auto"></img>
        </Col>
        <Col xs={8} sm={12}>
          <NavMenu />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default MainHeader;
