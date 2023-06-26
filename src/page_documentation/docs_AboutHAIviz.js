/* ============================================================================
============================================================================ */
import React from "react";
import { Typography, Divider } from "antd";
import { Link } from "react-router-dom";
import "./style_Documentation.css";

const { Title, Paragraph, Text } = Typography;
// const dataSource = [
//   {
//     key: "1",
//     edge: ">=87",
//     chrome: "last 2 version",
//     firefox: ">76",
//     safari: "last 2 version",
//     opera: "last 2 version",
//   },
// ];

// const columns = [
//   {
//     title: "MS Edge",
//     dataIndex: "edge",
//     key: "edge",
//   },
//   {
//     title: "Chrome",
//     dataIndex: "chrome",
//     key: "chrome",
//   },
//   {
//     title: "Firefox",
//     dataIndex: "firefox",
//     key: "firefox",
//   },
//   {
//     title: "Safari",
//     dataIndex: "safari",
//     key: "safari",
//   },
//   {
//     title: "Opera",
//     dataIndex: "opera",
//     key: "opera",
//   },
// ];

const AboutHAIviz = (props) => {
  return (
    <React.Fragment>
      <div className="haiviz-docs-content">
        <Title level={2}>About HAIviz</Title>
        <Paragraph>
          HAIviz is a single page visualization application designed to help
          infection control professionals to interactively visualize, integrate,
          and communicate information related with genomic epidemiological
          investigation at the local setting, such as hospital and other
          healthcare settings.
        </Paragraph>
        <Divider />
        <Title level={3}>When to use </Title>
        <Text>HAIviz can be useful for you when you want to:</Text>
        <ul>
          <li> Visualize outbreaks on a customized local map </li>
          <li> Integrate transmission information with phylogeny </li>
          <li>
            Visualize location movements (e.g, patient's ward or bed movement)
          </li>
          <li> Explore data using interactive visualization </li>
          <li>
            Animate the occurance of the outbreak cases using interactive
            timeline
          </li>
          <li>
            Rapidly create and download genomic epidemiological related
            visualization
          </li>
        </ul>
        <Divider />
        <Title level={3}>How to use </Title>
        <Text>
          To start using HAIviz, click{" "}
          <Link
            to="/haiviz-spa"
            onClick={() => {
              props.changeNavLocation("haivizApp");
            }}
          >
            {" "}
            here
          </Link>{" "}
          or click HAIviz App from the top navigation. Input the required
          file(s) and display the relevant visualization window from the menu.
          Check the tutorial section for more instructions.
        </Text>
        <Divider />
        <Title level={3}>Browser compatibility </Title>
        HAIviz is based on a create react app (CRA) tool and so it supports the
        majority of modern browsers. With the exception of Internet Explorer
        (IE), HAIviz was tested and compatible on the following desktop
        browsers:
        <ul>
          <li> Microsoft Edge (v.87) </li>
          <li> Safari (v.13.1.2)</li>
          <li> Chrome (v.87.0.4280) </li>
          <li> Firefox (v.84.0.1)</li>
          <li> Opera (v.73.0.3856) </li>
        </ul>
        <Divider />
        <Title level={3}>Core libraries</Title>
        <Text>
          Thanks to all awesome web frameworks and libraries run on the
          background, HAIviz is now up and running and available worldwide. The
          following are some of the core libraries used by HAIviz:
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
        <Divider />
        <Title level={3}>Have any questions? </Title>
        <Text>
          Please feel free to send it to my email:{" "}
          <span style={{ weight: "bold", color: "blue" }}>
            b.permana@uq.edu.au
          </span>
        </Text>
        <Divider />
        <Title level={3}>Cite us</Title>
        <Text>
          If you are happy to use HAIviz please cite our paper [available soon]
        </Text>
        <Divider />
      </div>
    </React.Fragment>
  );
};

export default AboutHAIviz;
