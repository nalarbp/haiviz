/* ============================================================================
============================================================================ */
import React from "react";
import { Typography } from "antd";
import "./style_Documentation.css";

const { Title } = Typography;

const Faq = () => {
  return (
    <React.Fragment>
      <div className="haiviz-docs-content">
        <Title level={2}>Frequently Asked Questions</Title>
        <Title level={3}>Updated soon</Title>
      </div>
    </React.Fragment>
  );
};

export default Faq;

/*
<Text>Localmap making ..</Text>
<Divider />

<Title level={3}>My tree scale is error </Title>
<Text>Localmap</Text>
<Divider />

<Title level={3}>My legends is out of the box tree </Title>
<Divider />

<Title level={3}>My browser is crushing</Title>
<Divider />

<Title level={3}>Need help?</Title>
<Divider />
*/
