import React from "react";
import { Button, Drawer, Select, Row, Col } from "antd";
const { Option } = Select;

const ColorScaleSettings = (props) => {
  //HANDLERS
  const setColorScaleHandler = (value) => {
    props.setselectedCategory(value);
  };
  const downloadSVGHandler = () => {
    props.changeIsColorScaleDownloading(true);
  };
  const getColorOption = function(header, i) {
    let label = header === "isolate_colLocation" ? "location" : header;
    return (
      <Option key={i} disabled={false} value={header}>
        {label}
      </Option>
    );
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
            <Select
              id={"colorscale-select"}
              style={{ width: "auto", marginBottom: "2px" }}
              placeholder={props.selectedCategory}
              onChange={setColorScaleHandler}
            >
              {props.colorScale && Object.keys(props.colorScale.colorMap)
                ? Object.keys(props.colorScale.colorMap).map((k, i) => {
                    return getColorOption(k, i);
                  })
                : ["na"].map((l, j) => {
                    return getColorOption(l, j);
                  })}
            </Select>
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
