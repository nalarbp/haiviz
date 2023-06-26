/* ============================================================================
============================================================================ */
import React from "react";
import { Button, Drawer, Slider, Row, Col } from "antd";
import { downloadSVG } from "../utils/utils";

const PhyloTreeGanttSettings = (props) => {
  //SETTINGS/STATE
  //HANDLERS
  const downloadSVGHandler = () => {
    downloadSVG("phylotreegantt-svg");
  };
  //tree label
  const textSizeHandler = (val) => {
    props.changeTreeGanttTextSize(val);
  };

  return (
    <React.Fragment>
      <Drawer
        title="Phylotreegantt settings"
        placement="right"
        closable={true}
        onClose={props.closeDrawerHandler}
        visible={props.isDrawerVisible}
        getContainer={true}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <p>Tree leaf label size </p>
            <Slider
              id={"phylotreegantt-change-textSize"}
              min={0}
              max={15}
              step={1}
              onChange={textSizeHandler}
              defaultValue={props.phylotreeGanttSettings.textSize}
            ></Slider>
          </Col>
          <Col span={24}>
            <Button onClick={downloadSVGHandler}>Download SVG</Button>
          </Col>
        </Row>
      </Drawer>
    </React.Fragment>
  );
};

export default PhyloTreeGanttSettings;
