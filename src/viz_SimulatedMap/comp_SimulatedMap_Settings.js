/* ============================================================================
============================================================================ */
import React from "react";
import { Button, Drawer, Slider, Checkbox, Row, Col, Select } from "antd";
import { capitalizeFirstLetter, downloadSVG } from "../utils/utils";

const { Option } = Select;

const SimulatedMapSettings = (props) => {
  //SETTINGS/STATE
  const layoutKey = props.simulatedmapSettings.layout;
  const layoutKeyText = capitalizeFirstLetter(layoutKey);

  //HANDLERS
  //-LAYOUT
  const downloadSVGHandler = () => {
    downloadSVG("simulatedmap-svg");
  };
  const simapLayoutHandler = (val) => {
    props.changeSimapLayout(val);
  };
  //-NODE
  const simapIsLocTextShownHandler = (e) => {
    let isChecked = e.target.checked;
    props.changeSimapIsLocTextShown(isChecked);
  };
  const nodeSizeHandler = (val) => {
    props.changeSimapNodeSize(val);
  };
  const textSizeHandler = (val) => {
    props.changeSimapTextSize(val);
  };
  //
  return (
    <React.Fragment>
      <Drawer
        title="Simulated map settings"
        placement="right"
        closable={true}
        onClose={props.closeDrawerHandler}
        visible={props.isDrawerVisible}
        getContainer={true}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <p>Node layout</p>
            <Select
              style={{ width: "100%" }}
              placeholder={layoutKeyText}
              onChange={simapLayoutHandler}
              value={layoutKey}
            >
              <Option value="scatter">Scatter</Option>
              <Option value="piechart">Piechart</Option>
            </Select>
          </Col>

          <Col span={24}>
            <Checkbox
              onChange={simapIsLocTextShownHandler}
              checked={props.simulatedmapSettings.isLocationLabelShown}
            >
              Show location label
            </Checkbox>
          </Col>

          <Col span={24}>
            <p>Node size </p>
            <Slider
              min={0}
              max={50}
              step={1}
              onChange={nodeSizeHandler}
              defaultValue={props.simulatedmapSettings.nodeSize}
            ></Slider>
          </Col>

          <Col span={24}>
            <p>Text size </p>
            <Slider
              disabled={!props.simulatedmapSettings.isLocationLabelShown}
              min={0}
              max={15}
              step={1}
              onChange={textSizeHandler}
              defaultValue={props.simulatedmapSettings.textSize}
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

export default SimulatedMapSettings;
