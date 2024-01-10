import React, { useState } from "react";
import { Menu, Layout } from "antd";
import AboutHAIviz from "./docs_AboutHAIviz";
import InputFormat from "./docs_InputFormat";
import { connect } from "react-redux";
import Visualization from "./docs_Tutorial";
import QuickStartGuide from "./docs_QuickStartGuide";
import { bindActionCreators } from "redux";
import { changeNavLocation } from "../action/navigation_actions";
import "./style_Documentation.css";

const { Sider, Content } = Layout;

const Documentation = (props) => {
  const [activeMenu, setActiveMenu] = useState("quick_start_guide");

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
            defaultSelectedKeys={["quick_start_guide"]}
          >
            <Menu.Item key="quick_start_guide">Quick Start Guide</Menu.Item>
            <Menu.Item key="haiviz">About HAIviz</Menu.Item>
            <Menu.Item key="input_format">Input format</Menu.Item>
            <Menu.Item key="tutorial">Tutorial </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ backgroundColor: "white", padding: "5px 20px" }}>
          {activeMenu === "quick_start_guide" && (
            <QuickStartGuide changeNavLocation={props.changeNavLocation} />
          )}
          {activeMenu === "haiviz" && (
            <AboutHAIviz changeNavLocation={props.changeNavLocation} />
          )}
          {activeMenu === "input_format" && (
            <InputFormat changeNavLocation={props.changeNavLocation} />
          )}
          {activeMenu === "tutorial" && (
            <Visualization changeNavLocation={props.changeNavLocation} />
          )}
        </Content>
      </Layout>
    </React.Fragment>
  );
};
function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators({ changeNavLocation: changeNavLocation }, dispatch);
}

export default connect(null, mapDispatchToProps)(Documentation);
