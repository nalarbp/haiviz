/* ============================================================================
============================================================================ */
import React from "react";
import { Typography, Divider } from "antd";
import { Link } from "react-router-dom";
import "./style_Documentation.css";
import { quickStartGuideFile } from "../utils/constants";
const { Title, Paragraph, Text } = Typography;

const AboutHAIviz = (props) => {
  return (
    <React.Fragment>
      <div className="haiviz-docs-content">
        <Title level={2}>About HAIviz</Title>
        <Paragraph>
          HAIviz is a web-based application to create an interactive dashboard
          for visualising and integrating healthcare-associated genomic
          epidemiological data.
        </Paragraph>
        <Title level={3}>When to use </Title>
        <Text>HAIviz can be useful for you when you want to:</Text>
        <ul>
          <li>Create and use a customised map to visualise outbreaks</li>
          <li>Visualise and integrate patient timeline for contact tracing</li>
          <li>Visualise and integrate transmission or cluster network </li>
          <li>Animate the outbreak</li>
          <li>Do it interactively, no scripting required </li>
        </ul>
        <Title level={3}>How to use </Title>
        <Text>
          Simply load your files into page{" "}
          <Link
            to="/input"
            onClick={() => {
              props.changeNavLocation("input");
            }}
          >
            {" "}
            input.
          </Link>{" "}
        </Text>
        <Title level={3}>Browser compatibility </Title>
        HAIviz is built using create react app (CRA), so it supports the
        majority of modern browsers. With the exception of Internet Explorer,
        HAIviz was tested and compatible on the following desktop browsers:
        <ul>
          <li> Microsoft Edge (v.87) </li>
          <li> Safari (v.13.1.2)</li>
          <li> Chrome (v.87.0.4280) </li>
          <li> Firefox (v.84.0.1)</li>
          <li> Opera (v.73.0.3856) </li>
        </ul>
        <Title level={3}>Core libraries</Title>
        <Text>
          Thanks to all the awesome web frameworks and libraries run on the
          background, HAIviz is available worldwide. The following are some of
          the core libraries used by HAIviz:
          <ul>
            <li>
              <a
                href="https://reactjs.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                React.js
              </a>
            </li>
            <li>
              <a
                href="https://d3js.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Data-Driven Documents (D3.js)
              </a>
            </li>
            <li>
              <a
                href="https://ant.design/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ant design UI
              </a>
            </li>
            <li>
              <a
                href="https://github.com/STRML/react-grid-layout"
                target="_blank"
                rel="noopener noreferrer"
              >
                React grid layout
              </a>
            </li>
            <li>
              <a
                href="http://phylocanvas.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Phylocanvas
              </a>
            </li>
            <li>
              <a
                href="https://js.cytoscape.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cytoscape
              </a>
            </li>
            <li>
              awesome CRA, @nivo/pie, babel-polyfill, cytoscape-svg, dotparser,
              newickparser, export-to-csv, immutable, lodash, moment,
              moment-range, phylocanvas-plugin-export-svg,
              phylocanvas-plugin-scalebar, prop-types, react-color,
              react-faux-dom, react-measure, react-player, redux, uuid,
              xml-formatter, xml-js, ...
            </li>
          </ul>
        </Text>
        <Title level={3}>Have any questions? </Title>
        <Text>
          Please feel free to send it to my email:{" "}
          <span style={{ weight: "bold", color: "blue" }}>
            b.permana@uq.edu.au
          </span>
        </Text>
        <Title level={3}>Cite us</Title>
        <Text>If you use HAIviz please cite this website</Text>
      </div>
    </React.Fragment>
  );
};

export default AboutHAIviz;
