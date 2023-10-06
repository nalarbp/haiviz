/* ============================================================================
============================================================================ */
import React from "react";
import { Button, Drawer, Slider, Checkbox, Row, Col, Select } from "antd";
import { capitalizeFirstLetter } from "../utils/utils";

const { Option } = Select;

const PhyloTreeSettings = (props) => {
  //SETTINGS/STATE
  const layoutKey = props.phylotreeSettings.layout;
  const layoutKeyText = capitalizeFirstLetter(layoutKey);
  const treeIsDownloading = props.phylotreeSettings.isDownloading;

  //HANDLERS
  //-LAYOUT
  const treeLayoutHandler = (val) => {
    props.changeTreeLayout(val);
  };
  //-DOWNLOAD
  const downloadSVGHandler = () => {
    if (!treeIsDownloading) {
      props.changeIsTreeDownloading(true);
    }
  };
  //-NODE
  const changeIsTreeNodeAlignedHandler = (e) => {
    let isChecked = e.target.checked;
    props.changeIsTreeNodeAligned(isChecked);
  };
  const textSizeHandler = (val) => {
    props.changeTreeTextSize(val);
  };
  //-SCALE

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
            <p>Tree layout</p>
            <Select
              style={{ width: "100%" }}
              placeholder={layoutKeyText}
              onChange={treeLayoutHandler}
              value={layoutKey}
            >
              <Option value="rectangular">Rectangular</Option>
              <Option value="radial">Radial</Option>
              <Option value="diagonal">Diagonal</Option>
            </Select>
          </Col>

          <Col span={24}>
            <Checkbox
              onChange={changeIsTreeNodeAlignedHandler}
              checked={props.phylotreeSettings.isTaxaAligned}
            >
              Align tree label
            </Checkbox>
          </Col>

          <Col span={24}>
            <p>Leaf label size </p>
            <Slider
              id={"phylotree-change-textSize"}
              min={0}
              max={15}
              step={1}
              onChange={textSizeHandler}
              defaultValue={props.phylotreeSettings.textSize}
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

export default PhyloTreeSettings;

/*archived

<Col span={24}>
  <p>Node size </p>
  <Slider
    id={"phylotree-change-nodeSize"}
    min={0}
    max={15}
    step={1}
    onChange={nodeSizeHandler}
    defaultValue={props.phylotreeSettings.nodeSize}
  ></Slider>
</Col>

<Col span={24}>
  <p>Node's label offset </p>
  <Slider
    id={"phylotree-change-textOffset"}
    min={-25}
    max={25}
    step={5}
    onChange={textOffsetHandler}
    defaultValue={props.phylotreeSettings.textOffset}
  ></Slider>
</Col>

<Col span={24}>
  <Checkbox
    onChange={isTreeScaleShownHandler}
    checked={props.phylotreeSettings.isScaleShown}
  >
    Show scale
  </Checkbox>
</Col>
<Col span={24}>
  <p>Scale</p>
  <InputNumber
    min={0.0001}
    step={0.01}
    value={props.phylotreeSettings.customScale}
    onChange={treeCustomScaleHandler}
    disabled={!props.phylotreeSettings.isScaleShown}
  />
</Col>
*/
