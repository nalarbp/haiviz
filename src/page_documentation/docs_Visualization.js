/* ============================================================================
============================================================================ */
import React from "react";
import ReactPlayer from "react-player/youtube";
import { Typography, Divider, Col, Row } from "antd";
import { quickStartGuideFile } from "../utils/constants";
import "./style_Documentation.css";

const { Title, Text } = Typography;
//
const Visualization = () => {
  const video_url = "https://youtu.be/JUUNn8KAcU0";
  return (
    <React.Fragment>
      <div className="haiviz-docs-content">
        <Row>
          <Col span={24}>
            <Title level={2}>HAIviz overview</Title>
          </Col>

          <Col span={24}>
            <ReactPlayer url={video_url} controls={true} />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Title level={3}>Quick start guide</Title>
            <Text>
              Download HAIviz quick start guide{" "}
              <a href={quickStartGuideFile}>here</a> for more information and
              instructions.
              <br />
            </Text>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Visualization;

/*
<ReactPlayer url="https://www.youtube.com/watch?v=cxswYcujKwc" />
<Text>Lalala ..</Text>
<Divider />

<Title level={3}>Resizing modules</Title>
<Text>Localmap</Text>
<Divider />

<Title level={3}>Changing module's setting</Title>
<Divider />

<Title level={3}>Download image created by module</Title>
*/
