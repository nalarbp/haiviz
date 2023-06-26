/* ============================================================================
============================================================================ */
import React from "react";
import { Button, Drawer, Select, Row, Col } from "antd";
import { ReloadOutlined, FormatPainterFilled } from "@ant-design/icons";
const { Option } = Select;

const ColorScaleSettings = (props) => {
  //HANDLERS
  const setColorScaleHandler = (value) => {
    props.setselectedCategory(value);
  };
  const grayAllOutHandler = () => {
    props.grayColorScaleStateHandler();
  };
  const resetColorHandler = () => {
    props.resetColorScaleStateHandler();
  };
  const downloadSVGHandler = () => {
    props.changeIsColorScaleDownloading(true);
  };

  return (
    <React.Fragment>
      <Drawer
        title="Color key settings"
        placement="right"
        closable={true}
        onClose={props.closeDrawerHandler}
        visible={props.isDrawerVisible}
        getContainer={true}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Select
              id={"colorscale-select"}
              style={{ width: "auto", marginBottom: "2px" }}
              placeholder={props.selectedCategory}
              onChange={setColorScaleHandler}
            >
              <Option value="location">Location</Option>
              <Option value="species">Species</Option>
              <Option value="sourceType">Source type</Option>
              <Option value="profile1">Profile 1</Option>
              <Option value="profile2">Profile 2</Option>
              <Option value="profile3">Profile 3</Option>
            </Select>
          </Col>
          <Col span={24}>
            <Button
              id={"colorscale-grayAll"}
              title={"Change all color to gray"}
              onClick={grayAllOutHandler}
            >
              Gray all color <FormatPainterFilled />
            </Button>
          </Col>
          <Col span={24}>
            <Button
              id={"colorscale-resetColor"}
              title={"Reset all color"}
              onClick={resetColorHandler}
            >
              Reset all color <ReloadOutlined />
            </Button>
          </Col>
          <Col span={24}>
            <Button onClick={downloadSVGHandler}>Download SVG</Button>
          </Col>
        </Row>
      </Drawer>
    </React.Fragment>
  );
};

export default ColorScaleSettings;
