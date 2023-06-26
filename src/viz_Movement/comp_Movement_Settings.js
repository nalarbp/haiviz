/* ============================================================================
============================================================================ */
import React from "react";
import { Button, Drawer, Checkbox, Row, Col, InputNumber, Input } from "antd";
import { downloadSVG } from "../utils/utils";

const MovementSettings = (props) => {
  //SETTINGS/STATE

  //HANDLERS

  const downloadSVGHandler = () => {
    downloadSVG("ganttChart-svg");
  };
  //-LAYOUT
  const showOverlappingLineHandler = (e) => {
    let isChecked = e.target.checked;
    props.changeIsOverlappingLineShown(isChecked);
  };
  const scaleOverlappingLineHandler = (e) => {
    let isChecked = e.target.checked;
    props.changeIsOverlappingLineScaled(isChecked);
  };
  const changeLineScaleFactorHandler = (val) => {
    props.changeOverlappingLineScaleFactor(val);
  };
  const changeSortedBySuffix = (e) => {
    let isChecked = e.target.checked;
    props.changeIsSortedBySuffix(isChecked);
  };
  const changeSuffixSeparator = (e) => {
    let val = e.target.value;
    props.changeSuffixSeparator(val);
  };
  const resortHandler = () => {
    let separator = props.movementSettings.suffixSeparator;
    let resortCode = "resort";
    if (separator.length > 0) {
      props.changeIsResort(resortCode.concat(separator));
    } else {
      alert(
        "Invalid suffix after splitting source_name. Please change the separator."
      );
    }
  };

  return (
    <React.Fragment>
      <Drawer
        title="Movement settings"
        placement="right"
        closable={true}
        onClose={props.closeDrawerHandler}
        visible={props.isDrawerVisible}
        getContainer={true}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Checkbox
              onChange={showOverlappingLineHandler}
              checked={props.movementSettings.isOverlappingLineShown}
            >
              Show overlapping lines
            </Checkbox>
          </Col>
          <Col span={24}>
            <Checkbox
              onChange={scaleOverlappingLineHandler}
              checked={props.movementSettings.isOverlappingLineScaled}
              disabled={!props.movementSettings.isOverlappingLineShown}
            >
              Scale the lines
            </Checkbox>
          </Col>
          <Col span={24}>
            <Checkbox
              onChange={changeSortedBySuffix}
              checked={props.movementSettings.isSortedBySuffix}
            >
              Sort Y-axis by suffix
            </Checkbox>
          </Col>
          <Col span={10}>
            <p>Separator</p>
          </Col>
          <Col span={6}>
            <Input
              maxLength={2}
              value={props.movementSettings.suffixSeparator}
              onChange={changeSuffixSeparator}
              disabled={!props.movementSettings.isSortedBySuffix}
            />
          </Col>
          <Col span={8}>
            <Button
              onClick={resortHandler}
              disabled={!props.movementSettings.isSortedBySuffix}
            >
              Sort
            </Button>
          </Col>
          <Col span={12}>
            <p>Scale factor</p>
          </Col>
          <Col span={12}>
            <InputNumber
              min={0.1}
              max={5}
              step={0.01}
              value={props.movementSettings.overlappingLineScaleFactor}
              onChange={changeLineScaleFactorHandler}
              disabled={!props.movementSettings.isOverlappingLineScaled}
            />
          </Col>

          <Col span={24}>
            <Button onClick={downloadSVGHandler}>Download SVG</Button>
          </Col>
        </Row>
      </Drawer>
    </React.Fragment>
  );
};

export default MovementSettings;
/*
<Col span={24}>
            <p>Layout</p>
            <Select
              style={{ width: "100%" }}
              placeholder={layoutKeyText}
              onChange={movementChartLayoutHandler}
              value={layoutKey}
            >
              <Option value="gantt">Gantt</Option>
            </Select>
          </Col>

const nodeSizeHandler = val => {
  props.changeMovementNodeSize(val);
};
const textSizeHandler = val => {
  props.changeMovementTextSize(val);
};
const textOffsetHandler = val => {
  props.changeMovementTextOffset(val);
};
<Col span={24}>
  <p>Node size </p>
  <Slider
    id={"movement-change-nodeSize"}
    min={0}
    max={15}
    step={1}
    onChange={nodeSizeHandler}
    defaultValue={props.movementSettings.nodeSize}
  ></Slider>
</Col>
<Col span={24}>
  <p>Text size </p>
  <Slider
    id={"movement-change-textSize"}
    min={0}
    max={15}
    step={1}
    onChange={textSizeHandler}
    defaultValue={props.movementSettings.textSize}
  ></Slider>
</Col>
<Col span={24}>
  <p>Text offset </p>
  <Slider
    id={"movement-change-textOffset"}
    min={-25}
    max={25}
    step={5}
    onChange={textOffsetHandler}
    defaultValue={props.movementSettings.textOffset}
  ></Slider>
</Col>
*/
