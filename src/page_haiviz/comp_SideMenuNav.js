/* ============================================================================

============================================================================ */
import React from "react";
import SideMenuButton from "./btn_SideMenu";
const SideMenuNav = props => {
  const non_activeCharts = Object.keys(props.activeChart)
    .map(key => {
      return { key: key, status: props.activeChart[key].show };
    })
    .filter(d => {
      return !d.status;
    });

  const menuIcon = non_activeCharts.map((d, idx) => {
    return <SideMenuButton key={d.key + idx} id={d.key} />;
  });
  return <React.Fragment>{menuIcon}</React.Fragment>;
};

export default SideMenuNav;
