import React from "react";
import { Row, Button, Col, Drawer, Checkbox, InputNumber } from "antd";
import "./style_TransGraph.css";

const TransmissionGraphSettings = (props) => {
  //SETTINGS
  const transgraphIsDownloading =
    props.transgraphSettings.transgraphIsDownloading;
  //HANDLERS
  const downloadSVGHandler = () => {
    if (!transgraphIsDownloading) {
      props.changeTransIsDownloading(true);
    }
  };
  const showNodeLabelHandler = (e) => {
    let isChecked = e.target.checked;
    props.changeTransIsNodeLabelShown(isChecked);
  };
  const showLinkLabelHandler = (e) => {
    let isChecked = e.target.checked;
    props.changeTransIsLinkLabelShown(isChecked);
  };
  const applyUserStyleHandler = (e) => {
    let isChecked = e.target.checked;
    props.changeTransisUserStyleApplied(isChecked);
  };
  const applyLinkWeightHandler = (e) => {
    let isChecked = e.target.checked;
    props.changeTransisLinkWeightApplied(isChecked);
  };
  const changeLinkFactorHandler = (val) => {
    props.changeTransLinkFactor(val);
  };

  // const setLayoutKeyHandler = (val) => {
  //   if (val === "host") {
  //     let isHostLayoutValid = false;
  //     const hostList = Array.from(props.isolateData.values()).map(
  //       (d) => d.isolate_sourceName
  //     );
  //     const nodesName = props.data.nodes.map((d) => d.name);
  //     for (var i = 0; i < nodesName.length; i++) {
  //       let node = nodesName[i];
  //       if (hostList.indexOf(node) === -1) {
  //         isHostLayoutValid = false;
  //         alert(
  //           "Node's name doesn't match with isolate_sourceName on the metadata"
  //         );
  //         break;
  //       } else {
  //         isHostLayoutValid = true;
  //       }
  //     }
  //     //console.log(hostList, nodesName);
  //     if (isHostLayoutValid) {
  //       props.changeTransLayoutKey(val);
  //     }
  //   } else if (val === "isolate") {
  //     props.changeTransLayoutKey(val);
  //   } else {
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
        <Row gutter={[1, 16]}>
          <Col span={24}>
            <Checkbox
              onChange={showNodeLabelHandler}
              checked={props.transgraphSettings.isNodeLabelShown}
            >
              Display node's label
            </Checkbox>
          </Col>
          <Col span={24}>
            <Checkbox
              onChange={showLinkLabelHandler}
              checked={props.transgraphSettings.isLinkLabelShown}
            >
              Display edges's label
            </Checkbox>
          </Col>
          <Col span={24}>
            <Checkbox
              onChange={applyUserStyleHandler}
              checked={props.transgraphSettings.isUserStyleApplied}
            >
              Apply user's style to edges
            </Checkbox>
          </Col>

          <Col span={24}>
            <Checkbox
              onChange={applyLinkWeightHandler}
              checked={props.transgraphSettings.isLinkWeightApplied}
            >
              Scale edges to its weight
            </Checkbox>
          </Col>

          <Col span={12}>
            <p>Scale factor</p>
          </Col>
          <Col span={12}>
            <InputNumber
              min={0.1}
              max={100}
              step={0.1}
              value={props.transgraphSettings.linkFactor}
              onChange={changeLinkFactorHandler}
              disabled={!props.transgraphSettings.isLinkWeightApplied}
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

export default TransmissionGraphSettings;

/*
<Col span={24}>
            <p>Layout key </p>
            <Select
              style={{ width: "100%" }}
              placeholder={layoutKeyText}
              onChange={setLayoutKeyHandler}
              value={layoutKey}
            >
              <Option value="isolate">Isolate</Option>
              <Option value="host">Host</Option>
            </Select>
          </Col>
<Divider style={{ marginBottom: "0px" }} />
<Col style={{ marginTop: "0px" }} span={24}>
            <p>Node size </p>
            <Slider
              id={"transgraph-change-nodeSize"}
              min={0}
              max={15}
              step={1}
              onChange={nodeSizeHandler}
              defaultValue={props.transgraphSettings.nodeSize}
            ></Slider>
          </Col>

          <Col span={24}>
            <p>Node's label size </p>
            <Slider
              id={"transgraph-change-textSize"}
              min={0}
              max={15}
              step={1}
              onChange={textSizeHandler}
              defaultValue={props.transgraphSettings.textSize}
            ></Slider>
          </Col>

          <Col span={24}>
            <Checkbox
              onChange={showLinkLabelHandler}
              checked={props.transgraphSettings.isLinkLabelShown}
            >
              Display link's label
            </Checkbox>
          </Col>
          <Col span={24}>
            <Checkbox
              onChange={applyLinkFilterHandler}
              checked={props.transgraphSettings.isUserStyleApplied}
            >
              Apply links filtering
            </Checkbox>
          </Col>
          <Col span={24}>
            <p>Mininum weight to be displayed</p>
            <InputNumber
              min={0.0001}
              step={0.01}
              value={props.transgraphSettings.transgraphIsDownloading}
              onChange={linkThresholdHandler}
              disabled={!props.transgraphSettings.isUserStyleApplied}
            />
          </Col>
<Col span={24}>
  <p>Node's label offset </p>
  <Slider
    id={"transgraph-change-textOffset"}
    min={-25}
    max={25}
    step={5}
    onChange={textOffsetHandler}
    defaultValue={props.transgraphSettings.textOffset}
  ></Slider>
</Col>
<Divider style={{ marginBottom: "0px" }} />

<p>Link's weight threshold</p>
<Slider
  id={"transgraph-change-linkThreshold"}
  min={-1}
  max={25}
  step={1}
  onChange={linkThresholdHandler}
  defaultValue={props.transgraphSettings.transgraphIsDownloading}
></Slider>
*/
