/* ============================================================================
============================================================================ */
import React from "react";
import { Typography, Divider, Button } from "antd";
import "./style_Documentation.css";
import * as constant from "../utils/constants";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const InputFormat = (props) => {
  return (
    <React.Fragment>
      <div className="haiviz-docs-content">
        <Title level={3}>Metadata</Title>
        <Text>
          A comma-separated value (CSV) table containing at least column id,
          date and location. Other columns can be added optionally. Column with
          prefix ":color" can be used to assign color. Column pid (patient id)
          is required to link the metadata with gantt chart.
        </Text>
        <br />
        <br />
        <Button type="primary" href={constant.TEMPLATE.isolateData}>
          Metadata example file
        </Button>
        <Divider />

        <Title level={3}>Map </Title>
        <Text>
          HAIviz map is an XML file that contains SVG map and location data.
          Create this map in page
          <Link
            to="/create-map"
            onClick={() => {
              props.changeNavLocation("createMap");
            }}
          >
            {" "}
            Map Editor{" "}
          </Link>
        </Text>
        <br />
        <br />
        <Button type="primary" href={constant.TEMPLATE.svg}>
          SVG example file
        </Button>
        <Button type="primary" href={constant.TEMPLATE.xmlData}>
          XML example file
        </Button>
        <Divider />

        <Title level={3}>Phylogenetic tree </Title>
        <Text>A Newick formatted tree with taxa name and branch length.</Text>
        <br />
        <br />
        <Button type="primary" href={constant.TEMPLATE.treeData}>
          Tree example file
        </Button>
        <Divider />

        <Title level={3}>Network </Title>
        <Text>
          Network input can be used load transmission or cluster or contact
          tracing network. This network (graph) file need to be formatted DOT
          language format.
        </Text>
        <br />
        <br />
        <Button type="primary" href={constant.TEMPLATE.transData}>
          Graph example file
        </Button>
        <Divider />

        <Title level={3}>Gantt chart</Title>
        <Text>
          Gantt chart is used to display patient (ward, bed) movement timeline.
          Input file for Gantt chart is a CSV table containing column: pid
          (patient id), start_date, end_date, and location. Column
          "location_color" can be used optionally to color the location.
        </Text>
        <br />
        <br />
        <Button type="primary" href={constant.TEMPLATE.movementData}>
          Gantt example file
        </Button>
        <Divider />
      </div>
    </React.Fragment>
  );
};

export default InputFormat;
