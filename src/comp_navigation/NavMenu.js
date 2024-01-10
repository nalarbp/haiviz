import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import history from "../utils/history";
import { changeNavLocation } from "../action/navigation_actions";

const NavMenu = (props) => {
  const currentKeys = props.navLocation
    ? props.navLocation
    : getKeyFromLocationPath(history.location.pathname);

  function getKeyFromLocationPath(location) {
    if (location) {
      switch (location) {
        case "/":
          return "home";
        case "/input":
          return "input";
        case "/visualisation":
          return "visualisation";
        case "/create-map":
          return "createMap";
        case "/haiviz-spa":
          return "haivizApp";
        case "/documentation":
          return "documentation";
        default:
          return "none";
      }
    } else {
      return "none";
    }
  }

  return (
    <React.Fragment>
      <Menu
        mode="horizontal"
        selectedKeys={[currentKeys]}
        overflowedIndicator={<MenuOutlined style={{ fontSize: "14pt" }} />}
        style={{ margin: "20px 0px 0 0" }}
      >
        <Menu.Item
          key="home"
          onClick={(e) => {
            props.changeNavLocation(e.key);
          }}
        >
          <NavLink to="/" exact>
            Home
          </NavLink>
        </Menu.Item>

        <Menu.Item
          key="input"
          onClick={(e) => {
            props.changeNavLocation(e.key);
          }}
        >
          <NavLink to="/input" exact>
            Input
          </NavLink>
        </Menu.Item>

        <Menu.Item
          key="createMap"
          onClick={(e) => {
            props.changeNavLocation(e.key);
          }}
        >
          <NavLink to="/create-map">Map Editor</NavLink>
        </Menu.Item>

        <Menu.Item
          key="haivizApp"
          onClick={(e) => {
            props.changeNavLocation(e.key);
          }}
        >
          <NavLink to={"/haiviz-spa"}>Dashboard</NavLink>
        </Menu.Item>

        <Menu.Item
          key="documentation"
          onClick={(e) => {
            props.changeNavLocation(e.key);
          }}
        >
          <NavLink to="/documentation">Documentation</NavLink>
        </Menu.Item>
      </Menu>
    </React.Fragment>
  );
};

function mapStateToProps(state, ownProps) {
  return { navLocation: state.navSettings.navLocation };
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      changeNavLocation: changeNavLocation,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NavMenu);

// selectedKeys={getSelectedKeys(history.location)}
