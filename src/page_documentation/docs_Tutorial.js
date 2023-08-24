import React from "react";
import ReactPlayer from "react-player/youtube";
import { Typography, Divider, Col, Row } from "antd";

import "./style_Documentation.css";

const { Title, Text } = Typography;
//
const Tutorial = () => {
  const video_url = "https://youtu.be/JUUNn8KAcU0";
  return (
    <React.Fragment>
      <div className="haiviz-docs-content">
        <Title level={2}>Tutorial Videos</Title>
        <Title level={3}>Video 1: HAIviz Overview</Title>
        <Text>
          Link: <a href={video_url}>{video_url}</a>
        </Text>
        <Divider />
        <Row>
          <Col span={24}>
            <ReactPlayer url={video_url} controls={true} />
          </Col>
        </Row>
        <Divider />
      </div>
    </React.Fragment>
  );
};

export default Tutorial;

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
