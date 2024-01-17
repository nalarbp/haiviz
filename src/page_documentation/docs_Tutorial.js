import React from "react";
import ReactPlayer from "react-player/youtube";
import { Typography, Divider, Col, Row } from "antd";

import "./style_Documentation.css";

const { Title, Text } = Typography;
//
const Tutorial = () => {
  const video_overview = "https://youtu.be/JUUNn8KAcU0";
  const video_run_development = "https://youtu.be/HCAzGgVypMk"
  const video_create_map = "https://youtu.be/zB1xrBK-yh4"
  const video_run_locally = "https://youtu.be/4QRZz9-H5AE"
  return (
    <React.Fragment>
      <div className="haiviz-docs-content">
        <Title level={2}>Tutorial Videos</Title>
        <Title level={3}>HAIviz overview</Title>
        <Text>
          Link: <a href={video_overview}>{video_overview}</a>
        </Text>
        <Divider />
        <Row>
          <Col span={24}>
            <ReactPlayer url={video_overview} controls={true} />
          </Col>
        </Row>
        <Divider />

        <Title level={3}>Create a map</Title>
        <Text>
          Link: <a href={video_create_map}>{video_create_map}</a>
        </Text>
        <Divider />
        <Row>
          <Col span={24}>
            <ReactPlayer url={video_create_map} controls={true} />
          </Col>
        </Row>
        <Divider />

        <Title level={3}>Running HAIviz locally</Title>
        <Text>
          Link: <a href={video_run_locally}>{video_run_locally}</a>
        </Text>
        <Divider />
        <Row>
          <Col span={24}>
            <ReactPlayer url={video_run_locally} controls={true} />
          </Col>
        </Row>
        <Divider />

        <Title level={3}>Running development mode</Title>
        <Text>
          Link: <a href={video_run_development}>{video_run_development}</a>
        </Text>
        <Divider />
        <Row>
          <Col span={24}>
            <ReactPlayer url={video_run_development} controls={true} />
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
