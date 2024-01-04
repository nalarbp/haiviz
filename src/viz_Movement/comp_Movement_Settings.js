import React from "react";
import { Button, Drawer, Checkbox, Row, Col, InputNumber } from "antd";
import { downloadSVG } from "../utils/utils";

const MovementSettings = (props) => {
 
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
  // const changeSortedBySuffix = (e) => {
  //   let isChecked = e.target.checked;
  //   props.changeIsSortedBySuffix(isChecked);
  // };
  // const changeSuffixSeparator = (e) => {
  //   let val = e.target.value;
  //   props.changeSuffixSeparator(val);
  // };
  // const resortHandler = () => {
  //   let separator = props.movementSettings.suffixSeparator;
  //   let resortCode = "resort";
  //   if (separator.length > 0) {
  //     props.changeIsResort(resortCode.concat(separator));
  //   } else {
  //     alert(
  //       "Invalid suffix after splitting source_name. Please change the separator."
  //     );
  //   }
  // };

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
