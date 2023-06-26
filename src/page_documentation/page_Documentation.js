/* ============================================================================
============================================================================ */
import React, { useState } from "react";
import { Menu, Layout } from "antd";
import AboutHAIviz from "./docs_AboutHAIviz";
import InputFormat from "./docs_InputFormat";
import { connect } from "react-redux";
import Faq from "./docs_Faq";
import Visualization from "./docs_Visualization";
import HowToUse from "./docs_HowToUse";
import { bindActionCreators } from "redux";
import { changeNavLocation } from "../action/navigation_actions";
import "./style_Documentation.css";

const { Sider, Content } = Layout;

const Documentation = (props) => {
  const [activeMenu, setActiveMenu] = useState("haiviz");

  const onClickHandler = (e) => {
    setActiveMenu(e.key);
  };

  return (
    <React.Fragment>
      <Layout id="page-documentation">
        <Sider
          style={{ backgroundColor: "white" }}
          breakpoint="sm"
          collapsedWidth="0"
        >
          <Menu
            theme="light"
            mode="vertical"
            onClick={onClickHandler}
            defaultSelectedKeys={["haiviz"]}
          >
            <Menu.Item key="haiviz">About HAIviz</Menu.Item>
            <Menu.Item key="input_format">Input format</Menu.Item>
            <Menu.Item key="visualization">Quick start guide </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ backgroundColor: "white", padding: "5px 20px" }}>
          {activeMenu === "haiviz" && (
            <AboutHAIviz changeNavLocation={props.changeNavLocation} />
          )}
          {activeMenu === "input_format" && (
            <InputFormat changeNavLocation={props.changeNavLocation} />
          )}
          {activeMenu === "visualization" && (
            <Visualization changeNavLocation={props.changeNavLocation} />
          )}
          {activeMenu === "howtouse" && (
            <HowToUse changeNavLocation={props.changeNavLocation} />
          )}
          {activeMenu === "faq" && <Faq />}
        </Content>
      </Layout>
    </React.Fragment>
  );
};
function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators({ changeNavLocation: changeNavLocation }, dispatch);
}

export default connect(null, mapDispatchToProps)(Documentation);

/*
<Menu.Item key="visualization">Tutorial videos </Menu.Item>
<Menu.Item key="howtouse">How to use</Menu.Item>
<Menu.Item key="faq">FAQ</Menu.Item>
*/
