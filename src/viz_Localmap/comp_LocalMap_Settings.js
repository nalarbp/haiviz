/* ============================================================================
============================================================================ */
import React from "react";
import { Button, Drawer, Slider, Checkbox, Row, Col, Select } from "antd";
import { capitalizeFirstLetter, downloadSVG } from "../utils/utils";

const { Option } = Select;

const LocalMapSettings = (props) => {
  //SETTINGS/STATE
  const layoutKey = props.localmapSettings.layout;
  const layoutKeyText = capitalizeFirstLetter(layoutKey);

  //HANDLERS
  const downloadSVGHandler = () => {
    downloadSVG("localmap-svg");
  };
  //-LAYOUT
  const localmapLayoutHandler = (val) => {
    props.changeLocalmapLayout(val);
  };
  //-NODE
  const localmapIsLocTextShownHandler = (e) => {
    let isChecked = e.target.checked;
    props.changeLocalmapIsLocTextShown(isChecked);
  };
  const nodeSizeHandler = (val) => {
    props.changeLocalmapNodeSize(val);
  };
  const textSizeHandler = (val) => {
    props.changeLocalmapTextSize(val);
  };
  const textOffsetHandler = (val) => {
    props.changeLocalmapTextOffset(val);
  };

  return (
    <React.Fragment>
      <Drawer
        title="Settings"
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
              onChange={localmapLayoutHandler}
              value={layoutKey}
            >
              <Option value="scatter">Scatter</Option>
              <Option value="piechart">Piechart</Option>
            </Select>
          </Col>

          <Col span={24}>
            <Checkbox
              onChange={localmapIsLocTextShownHandler}
              checked={props.localmapSettings.isLocTextShown}
            >
              Show location label
            </Checkbox>
          </Col>

          <Col span={24}>
            <p>Node size </p>
            <Slider
              id={"localmap-change-nodeSize"}
              min={0}
              max={50}
              step={1}
              onChange={nodeSizeHandler}
              defaultValue={props.localmapSettings.nodeSize}
            ></Slider>
          </Col>

          <Col span={24}>
            <p>Text size </p>
            <Slider
              id={"localmap-change-textSize"}
              disabled={!props.localmapSettings.isLocTextShown}
              min={0}
              max={15}
              step={1}
              onChange={textSizeHandler}
              defaultValue={props.localmapSettings.textSize}
            ></Slider>
          </Col>

          <Col span={24}>
            <p>Text offset </p>
            <Slider
              id={"localmap-change-textOffset"}
              disabled={!props.localmapSettings.isLocTextShown}
              min={-25}
              max={25}
              step={5}
              onChange={textOffsetHandler}
              defaultValue={props.localmapSettings.textOffset}
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

export default LocalMapSettings;
